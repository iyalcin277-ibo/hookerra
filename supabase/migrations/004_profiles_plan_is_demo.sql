-- Add plan and is_demo columns to profiles
-- plan  : mirrors subscription_status but uses 'free' instead of 'starter'
-- is_demo: true while on free tier, false once a paid subscription is active

alter table public.profiles
  add column if not exists plan text not null default 'free'
    check (plan in ('free', 'pro', 'unlimited')),
  add column if not exists is_demo boolean not null default true;

-- Back-fill existing paid rows
update public.profiles
  set
    plan = case
      when subscription_status = 'pro'                                   then 'pro'
      when subscription_status in ('unlimited','elite','enterprise')     then 'unlimited'
      else 'free'
    end,
    is_demo = (subscription_status = 'starter')
  where true;
