import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@/lib/supabase/server';
import {
  hooksPerResponse,
  isToneUnlockedForTier,
  monthlyGenerationLimit,
  normalizeTier,
} from '@/lib/plans';

function startOfUtcMonth(): string {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0, 0)).toISOString();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, tone } = body as {
      topic?: string;
      tone?: string;
    };

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Topic is required.' }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', user.id)
      .single();

    const tier = normalizeTier(profile?.subscription_status);

    if (!isToneUnlockedForTier(tier, tone ?? '')) {
      return NextResponse.json(
        {
          error: 'This tone is only available on Pro or Unlimited plans. Upgrade to unlock it.',
          code: 'TONE_LOCKED',
        },
        { status: 403 }
      );
    }

    const limit = monthlyGenerationLimit(tier);
    if (limit !== 'unlimited') {
      const { count, error: countError } = await supabase
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfUtcMonth());

      if (countError) {
        console.error(countError);
      }
      if ((count ?? 0) >= limit) {
        return NextResponse.json(
          {
            error: `You have reached your monthly limit of ${limit} generations. Upgrade to Pro or Unlimited.`,
            code: 'LIMIT',
          },
          { status: 402 }
        );
      }
    }

    const hookTarget = hooksPerResponse(tier);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Server configuration error (GEMINI_API_KEY missing).' },
        { status: 500 }
      );
    }

    const model = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `You are a viral social media strategist. Respond in the same language as the user's input (English or any other language).
Output ONLY valid JSON; no markdown or explanations. Schema exactly: {"hooks":[ ... exactly ${hookTarget} strings ... ]}
Each item must be a single line — a powerful opening sentence optimized to stop the scroll in the first 3 seconds. The hooks array length must be exactly ${hookTarget}.`;

    const userPrompt = `Topic: ${topic.trim()}
Tone: ${tone ?? 'Professional'}

Generate exactly ${hookTarget} hooks; follow the JSON schema.`;

    const response = await ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.85,
      },
    });

    const text = response.text ?? '';
    let hooks: string[] = [];

    const jsonMatch = text.match(/\{[\s\S]*"hooks"[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]) as { hooks?: string[] };
        hooks = Array.isArray(parsed.hooks) ? parsed.hooks.map(String).filter(Boolean) : [];
      } catch {
        hooks = [];
      }
    }

    hooks = hooks.slice(0, hookTarget);

    if (hooks.length === 0) {
      return NextResponse.json(
        { error: 'Could not parse AI output. Please try again.' },
        { status: 422 }
      );
    }

    const { error: insertError } = await supabase.from('generations').insert({
      user_id: user.id,
      input_text: topic.trim(),
      tone: tone ?? null,
      platform: null,
      ai_output: { hooks },
    });

    if (insertError) {
      console.error(insertError);
      let detail = insertError.message ?? 'Unknown Supabase error.';
      if (insertError.code === 'PGRST205') {
        detail +=
          ' Table missing or not visible to API: run supabase/migrations/001_hookerra.sql then 002_generations_api_fix.sql in the SQL Editor and make sure the project is correct.';
      }
      if (insertError.code === '42501') {
        detail += ' Permission (GRANT) or RLS denial — apply the grant/policy lines in the migration.';
      }
      if (insertError.code === '23514') {
        detail +=
          ' profiles.subscription_status value is invalid: run supabase/migrations/003_profiles_subscription_pro_unlimited.sql.';
      }
      return NextResponse.json(
        { error: detail, code: insertError.code },
        { status: 500 }
      );
    }

    return NextResponse.json({ hooks });
  } catch (e) {
    console.error(e);
    const msg =
      e instanceof Error ? e.message.slice(0, 400) : 'Unexpected error.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
