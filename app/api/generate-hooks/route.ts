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
    const { topic, tone, platform } = body as {
      topic?: string;
      tone?: string;
      platform?: string;
    };

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Konu gerekli.' }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Oturum gerekli.' }, { status: 401 });
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
          error:
            'Bu ton yalnızca Pro veya Sınırsız pakette kullanılabilir. Paketini yükselt.',
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
            error: `Bu ayki ${limit} üretim hakkınız doldu. Pro veya Sınırsız pakete geçin.`,
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
        { error: 'Sunucu yapılandırması eksik (GEMINI_API_KEY).' },
        { status: 500 }
      );
    }

    const model = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `Sen viral sosyal medya stratejisti rolündesin. Kullanıcı girdisinin dilinde (Türkçe veya İngilizce) yanıt ver.
Çıktı SADECE geçerli JSON olmalı; markdown veya açıklama yok. Şema tam olarak: {"hooks":[ ... tam olarak ${hookTarget} adet string ... ]}
Her öğe tek satır, ilk 3 saniyede kaydıran güçlü bir kanca cümlesi olsun. hooks dizisi uzunluğu kesinlikle ${hookTarget} olmalı.`;

    const userPrompt = `Konu: ${topic.trim()}
Ton: ${tone ?? 'Profesyonel'}
Platform: ${platform ?? 'X'}

Tam ${hookTarget} hook üret; JSON şemasına uy.`;

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
        { error: 'AI çıktısı işlenemedi. Tekrar deneyin.' },
        { status: 422 }
      );
    }

    const { error: insertError } = await supabase.from('generations').insert({
      user_id: user.id,
      input_text: topic.trim(),
      tone: tone ?? null,
      platform: platform ?? null,
      ai_output: { hooks },
    });

    if (insertError) {
      console.error(insertError);
      let detail = insertError.message ?? 'Bilinmeyen Supabase hatası.';
      if (insertError.code === 'PGRST205') {
        detail +=
          ' Tablo eksik veya API henüz görmüyor: SQL Editor’da `supabase/migrations/001_hookerra.sql` ve ardından `002_generations_api_fix.sql` çalıştırın; Dashboard’da project doğru olduğundan emin olun.';
      }
      if (insertError.code === '42501') {
        detail += ' İzin (GRANT) veya RLS reddi — migration’daki grant/policy satırlarını uygulayın.';
      }
      if (insertError.code === '23514') {
        detail +=
          ' profiles.subscription_status değeri geçersiz: SQL’de `003_profiles_subscription_pro_unlimited.sql` çalıştırın.';
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
      e instanceof Error ? e.message.slice(0, 400) : 'Beklenmeyen hata.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
