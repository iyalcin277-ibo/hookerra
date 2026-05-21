-- Ek paket değerleri: pro, unlimited (elite/enterprise geriye dönük)
alter table public.profiles drop constraint if exists profiles_subscription_status_check;

alter table public.profiles add constraint profiles_subscription_status_check
  check (
    subscription_status in ('starter', 'pro', 'unlimited', 'elite', 'enterprise')
  );

-- İsterseniz eski etiketleri yeni modele çekin (isteğe bağlı — çalıştırmadan önce yedek alın)
-- update public.profiles set subscription_status = 'unlimited' where subscription_status in ('elite', 'enterprise');
