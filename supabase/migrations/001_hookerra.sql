-- Hookerra: profiles + generations + RLS + auth trigger
-- Supabase SQL Editor veya CLI ile çalıştırın.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  subscription_status text not null default 'starter'
    check (subscription_status in ('starter', 'elite', 'enterprise')),
  updated_at timestamptz default now()
);

create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  input_text text not null,
  tone text,
  platform text,
  ai_output jsonb not null,
  created_at timestamptz default now()
);

create index if not exists generations_user_created_idx
  on public.generations (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.generations enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "generations_select_own"
  on public.generations for select
  using (auth.uid() = user_id);

create policy "generations_insert_own"
  on public.generations for insert
  with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
