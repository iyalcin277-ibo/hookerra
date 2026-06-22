import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@/lib/supabase/server';
import { normalizeTier, hashtagsPerResponse } from '@/lib/plans';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic } = body as { topic?: string };

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
    const count = hashtagsPerResponse(tier);

    if (!count) {
      return NextResponse.json(
        {
          error: 'Hashtag generation is available on Pro and Unlimited plans. Upgrade to unlock it.',
          code: 'TIER_LOCKED',
        },
        { status: 403 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Server configuration error (GEMINI_API_KEY missing).' },
        { status: 500 }
      );
    }

    const model = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are a social media hashtag expert. Respond in the same language as the user's input.
Output ONLY valid JSON; no markdown or explanations. Schema exactly: {"hashtags":[ ... exactly ${count} strings ... ]}
Each hashtag must start with #, be a single word or camelCase, and be popular and relevant to the topic. The hashtags array length must be exactly ${count}.`;

    const userPrompt = `Topic: ${topic.trim()}

Generate exactly ${count} viral and relevant hashtags for this topic; follow the JSON schema.`;

    const response = await ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text ?? '';
    let hashtags: string[] = [];

    const jsonMatch = text.match(/\{[\s\S]*"hashtags"[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]) as { hashtags?: string[] };
        hashtags = Array.isArray(parsed.hashtags)
          ? parsed.hashtags.map(String).filter(Boolean)
          : [];
      } catch {
        hashtags = [];
      }
    }

    hashtags = hashtags.slice(0, count);

    if (hashtags.length === 0) {
      return NextResponse.json(
        { error: 'Could not parse AI output. Please try again.' },
        { status: 422 }
      );
    }

    return NextResponse.json({ hashtags });
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message.slice(0, 400) : 'Unexpected error.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
