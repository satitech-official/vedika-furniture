-- Execute once in Supabase SQL editor. Never expose service_role credentials in the browser.
create extension if not exists pgcrypto;
create table if not exists public.vedika_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  razorpay_order_id text not null unique,
  razorpay_payment_id text unique,
  tracking_token_hash text not null unique,
  customer jsonb not null,
  items jsonb not null,
  amount_paise bigint not null check (amount_paise >= 100),
  shipping_paise integer not null check (shipping_paise >= 0),
  status text not null default 'payment_pending' check (status in ('payment_pending','paid','payment_failed','cancelled','refunded')),
  delivery_status text not null default 'not_dispatched' check (delivery_status in ('not_dispatched','processing','packed','shipped','out_for_delivery','delivered','cancelled'))
);
create index if not exists vedika_orders_created_at_idx on public.vedika_orders (created_at desc);
alter table public.vedika_orders enable row level security;
-- All reading/writing uses the server-side service role only. No public RLS policies.
create or replace function public.vedika_orders_updated_at() returns trigger language plpgsql as $$begin new.updated_at=now();return new;end;$$;
drop trigger if exists trg_vedika_orders_updated_at on public.vedika_orders;
create trigger trg_vedika_orders_updated_at before update on public.vedika_orders for each row execute function public.vedika_orders_updated_at();
-- Fulfilment staff can update delivery_status in the Supabase dashboard until an authenticated admin UI is built.
