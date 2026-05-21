# Hookerra

AI destekli hook üretimi: **Next.js (App Router)**, **Supabase** (auth + PostgreSQL), **Gemini** (yalnızca sunucuda — API route).

Tasarım: `.cursorrules` ve `projeplan.md` ile uyumlu **Aggressive Dark** (#000000 / #121212 / #FF0000).

## Kurulum

1. Bağımlılıklar: `npm install`
2. Ortam değişkenleri (`.env.local`, örnek: `.env.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SITE_URL` (OAuth için, örn. `http://localhost:3000`)
3. Supabase SQL Editor’da `supabase/migrations/001_hookerra.sql` dosyasını çalıştırın.
4. Geliştirme: `npm run dev` → [http://localhost:3000](http://localhost:3000)

Üretim anahtarları istemciye verilmez; hook üretimi `POST /api/generate-hooks` üzerinden yapılır.
