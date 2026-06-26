-- Store Paddle subscription & customer IDs for billing management
alter table public.profiles
  add column if not exists paddle_subscription_id text,
  add column if not exists paddle_customer_id     text;
