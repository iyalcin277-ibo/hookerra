import type { NextConfig } from 'next';
import { loadEnvConfig } from '@next/env';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(process.cwd());
loadEnvConfig(rootDir);

/** Bazı Windows kurulumlarında Next `.env.local` okuyamaz; dosyayı doğrudan parse edip process.env'e yazar. */
function parseEnvFile(filePath: string): Record<string, string> {
  try {
    if (!fs.existsSync(filePath)) return {};
    const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    const out: Record<string, string> = {};
    for (const line of raw.split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('=');
      if (eq <= 0) continue;
      const key = t.slice(0, eq).trim();
      let val = t.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      out[key] = val;
    }
    return out;
  } catch {
    return {};
  }
}

const fromLocal = parseEnvFile(path.join(rootDir, '.env.local'));

const mergeKeys = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'GEMINI_API_KEY',
  'GEMINI_MODEL',
  'NEXT_PUBLIC_SITE_URL',
] as const;

for (const key of mergeKeys) {
  const existing = process.env[key]?.trim();
  const fileVal = fromLocal[key]?.trim();
  if (!existing && fileVal) {
    process.env[key] = fileVal;
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? '',
  },
};

export default nextConfig;
