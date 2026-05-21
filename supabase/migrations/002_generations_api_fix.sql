-- Hookerra — PGRST205: "generations tablosu schema cache'te yok" için tamamlayıcı betik
-- Supabase → SQL Editor'da çalıştırın (001 zaten uygulandıysa da güvenle çalıştırılabilir).

create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  input_text text not null,
  tone text,
  platform text,
  ai_output jsonb not null,
  created_at timestamptz default now()
);

alter table public.generations enable row level security;

-- PostgREST'in authenticated JWT ile kullanması için politikaları rol ile netleştir
drop policy if exists "generations_select_own" on public.generations;
drop policy if exists "generations_insert_own" on public.generations;

create policy "generations_select_own"
  on public.generations
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "generations_insert_own"
  on public.generations
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

grant usage on schema public to authenticated;
grant select, insert, delete on table public.generations to authenticated;

-- Şema önbelleği birkaç saniye içinde güncellenir; olmazsa Supabase Dashboard'dan projeyi yeniden başlatmayı deneyin.