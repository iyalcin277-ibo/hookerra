import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@/lib/supabase/server';
import {
  contentGenSettings,
  resolveCTACount,
  isToneUnlockedForTier,
  monthlyGenerationLimit,
  normalizeTier,
  type ContentPack,
} from '@/lib/plans';

function startOfUtcMonth(): string {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0, 0)).toISOString();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, tone } = body as { topic?: string; tone?: string };

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
          error: 'This tone requires a Pro or Unlimited plan. Upgrade to unlock it.',
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

      if (countError) console.error(countError);

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

    const settings = contentGenSettings(tier);
    const { hookCount, hashtagCount, scriptDepth } = settings;
    const ctaCount = resolveCTACount(settings.ctaCount);
    const ctaIsUnlimited = settings.ctaCount === 'unlimited';

    const scriptLengthGuide =
      scriptDepth === 'basic'
        ? '80–120 words, 3 scenes'
        : scriptDepth === 'standard'
          ? '150–220 words, 5 scenes'
          : '250–350 words, 7 scenes with B-roll notes';

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Server configuration error (GEMINI_API_KEY missing).' },
        { status: 500 }
      );
    }

    const model = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are an elite viral social media content strategist and copywriter. Your job is to generate a complete, ready-to-publish content production package.

Respond in the SAME LANGUAGE as the user's topic input (detect and match it exactly).
Output ONLY valid JSON — no markdown fences, no commentary, no extra keys.

Required JSON schema (all keys mandatory, exact types):
{
  "hooks": [ /* exactly ${hookCount} strings — powerful scroll-stopping opening lines under 15 words each, optimized for the first 3 seconds of Reels, TikTok, and Shorts */ ],
  "script": "/* Complete short-form video script (${scriptLengthGuide}). Include [SCENE X] labels, speaker notes, B-roll suggestions where applicable. End with a strong outro CTA. */",
  "caption": "/* Full post caption: open with a strong hook line, use line breaks for readability, include 2–3 relevant emojis, end with an engagement question. No hashtags inside the caption. */",
  "ctas": [ /* ${ctaIsUnlimited ? `generate as many high-quality CTAs as possible (aim for ${ctaCount}+)` : `exactly ${ctaCount} strings`} — high-conversion calls-to-action. Each must be specific, action-oriented, and under 12 words. */ ],
  "hashtags": [ /* exactly ${hashtagCount} strings — each starting with #, mix of broad (3), niche (5), and trending/semantic tags. Optimized for discovery on Instagram, TikTok, and LinkedIn. */ ]
}

Quality standards:
- Hooks: curiosity gaps, bold claims, relatable pain points, or shocking statistics — never generic.
- Script: natural spoken language, punchy sentences, high retention structure (hook → tension → payoff).
- Caption: conversational tone, value-first, save-worthy content.
- CTAs: direct verbs (Save, Share, Comment, DM, Click), specific outcomes.
- Hashtags: avoid banned or irrelevant tags; prioritize discoverability.`;

    const userPrompt = `Topic: ${topic.trim()}
Tone: ${tone ?? 'Professional'}

Generate a complete content package with all 5 asset types. Follow the schema exactly.`;

    const response = await ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.82,
      },
    });

    const text = response.text ?? '';

    const jsonMatch = text.match(/\{[\s\S]*"hooks"[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Could not parse AI output. Please try again.' },
        { status: 422 }
      );
    }

    let pack: ContentPack;
    try {
      const raw = JSON.parse(jsonMatch[0]) as Partial<ContentPack>;
      pack = {
        hooks: Array.isArray(raw.hooks) ? raw.hooks.map(String).filter(Boolean).slice(0, hookCount) : [],
        script: typeof raw.script === 'string' ? raw.script : '',
        caption: typeof raw.caption === 'string' ? raw.caption : '',
        ctas: Array.isArray(raw.ctas) ? raw.ctas.map(String).filter(Boolean).slice(0, ctaCount) : [],
        hashtags: Array.isArray(raw.hashtags) ? raw.hashtags.map(String).filter(Boolean).slice(0, hashtagCount) : [],
      };
    } catch {
      return NextResponse.json(
        { error: 'Could not parse AI output. Please try again.' },
        { status: 422 }
      );
    }

    if (pack.hooks.length === 0) {
      return NextResponse.json(
        { error: 'AI returned empty hooks. Please try again.' },
        { status: 422 }
      );
    }

    const { error: insertError } = await supabase.from('generations').insert({
      user_id: user.id,
      input_text: topic.trim(),
      tone: tone ?? null,
      platform: null,
      ai_output: pack,
    });

    if (insertError) {
      console.error(insertError);
      let detail = insertError.message ?? 'Unknown Supabase error.';
      if (insertError.code === 'PGRST205') {
        detail += ' Table missing — run migrations 001 and 002 in Supabase SQL Editor.';
      }
      if (insertError.code === '42501') {
        detail += ' RLS/grant issue — apply migration policy lines.';
      }
      if (insertError.code === '23514') {
        detail += ' Invalid subscription_status — run migration 003.';
      }
      return NextResponse.json({ error: detail, code: insertError.code }, { status: 500 });
    }

    return NextResponse.json(pack);
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message.slice(0, 400) : 'Unexpected error.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
