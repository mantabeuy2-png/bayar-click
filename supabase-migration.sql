-- ============================================================
-- Bayar.Click — Database Migration
-- Execute this in Supabase SQL Editor
-- ============================================================

-- 1. EXTENSIONS
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- 2. ENUM TYPES
create type provider_type as enum ('gopay', 'bca', 'dana', 'ovo', 'shopeepay', 'linkaja', 'other');
create type merchant_status as enum ('active', 'inactive', 'pending');
create type link_status as enum ('active', 'expired', 'disabled');
create type transaction_status as enum ('pending', 'paid', 'failed', 'expired');
create type validation_method as enum ('manual', 'auto', 'polling');
create type plan_type as enum ('free', 'starter', 'pro', 'business');

-- 3. TABLES

-- Merchants (QRIS merchant accounts)
create table if not exists merchants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  provider provider_type not null default 'other',
  account_name text not null,
  qr_image_url text,
  qr_data text,
  status merchant_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Payment Links
create table if not exists payment_links (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  title text not null,
  description text,
  amount decimal(12,2),
  currency text not null default 'IDR',
  expiry_at timestamptz,
  redirect_success_url text,
  redirect_failed_url text,
  status link_status not null default 'active',
  qr_image_url text,
  short_url text unique not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Transactions
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  payment_link_id uuid references payment_links(id) on delete set null,
  merchant_id uuid not null references merchants(id) on delete cascade,
  external_id text unique not null,
  amount decimal(12,2) not null,
  status transaction_status not null default 'pending',
  payer_name text,
  payer_note text,
  paid_at timestamptz,
  confirmed_by uuid references auth.users(id),
  validation_method validation_method not null default 'manual',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Credits
create table if not exists credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  balance integer not null default 0,
  used integer not null default 0,
  plan plan_type not null default 'free',
  created_at timestamptz not null default now()
);

-- Webhooks
create table if not exists webhooks (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  url text not null,
  events text[] not null default '{}',
  secret text not null default encode(gen_random_bytes(32), 'hex'),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- API Keys
create table if not exists api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  key_hash text not null,
  permissions text[] not null default '{read}',
  last_used_at timestamptz,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

-- 4. INDEXES
create index idx_merchants_user_id on merchants(user_id);
create index idx_payment_links_merchant_id on payment_links(merchant_id);
create index idx_payment_links_short_url on payment_links(short_url);
create index idx_transactions_merchant_id on transactions(merchant_id);
create index idx_transactions_payment_link_id on transactions(payment_link_id);
create index idx_transactions_status on transactions(status);
create index idx_transactions_external_id on transactions(external_id);
create index idx_webhooks_merchant_id on webhooks(merchant_id);
create index idx_api_keys_user_id on api_keys(user_id);
create index idx_credits_user_id on credits(user_id);

-- 5. AUTO-UPDATE UPDATED_AT TRIGGERS
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_merchants_updated_at
  before update on merchants
  for each row execute function update_updated_at_column();

create trigger update_payment_links_updated_at
  before update on payment_links
  for each row execute function update_updated_at_column();

create trigger update_transactions_updated_at
  before update on transactions
  for each row execute function update_updated_at_column();

-- 6. SHORT URL GENERATION FUNCTION
create or replace function generate_short_url()
returns text
language plpgsql
as $$
declare
  chars text := 'abcdefghijklmnopqrstuvwxyz0123456789';
  result text := '';
  i int;
begin
  for i in 1..8 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  end loop;
  return result;
end;
$$;

-- 7. ROW LEVEL SECURITY
alter table merchants enable row level security;
alter table payment_links enable row level security;
alter table transactions enable row level security;
alter table credits enable row level security;
alter table webhooks enable row level security;
alter table api_keys enable row level security;

-- Users can only see their own data
create policy "Users can view own merchants"
  on merchants for select
  using (auth.uid() = user_id);

create policy "Users can insert own merchants"
  on merchants for insert
  with check (auth.uid() = user_id);

create policy "Users can update own merchants"
  on merchants for update
  using (auth.uid() = user_id);

create policy "Users can delete own merchants"
  on merchants for delete
  using (auth.uid() = user_id);

-- Payment links: users can see merchant's links
create policy "Users can view own payment links"
  on payment_links for select
  using (merchant_id in (select id from merchants where user_id = auth.uid()));

create policy "Users can insert payment links"
  on payment_links for insert
  with check (merchant_id in (select id from merchants where user_id = auth.uid()));

create policy "Users can update own payment links"
  on payment_links for update
  using (merchant_id in (select id from merchants where user_id = auth.uid()));

create policy "Users can delete own payment links"
  on payment_links for delete
  using (merchant_id in (select id from merchants where user_id = auth.uid()));

-- Public can read active payment links by short_url
create policy "Public can view active payment links"
  on payment_links for select
  using (status = 'active');

-- Transactions: users can see their merchant's transactions
create policy "Users can view own transactions"
  on transactions for select
  using (merchant_id in (select id from merchants where user_id = auth.uid()));

create policy "Users can insert transactions"
  on transactions for insert
  with check (true); -- Allow public to create transactions

create policy "Users can update own transactions"
  on transactions for update
  using (merchant_id in (select id from merchants where user_id = auth.uid()));

-- Credits
create policy "Users can view own credits"
  on credits for select
  using (auth.uid() = user_id);

create policy "Users can insert own credits"
  on credits for insert
  with check (auth.uid() = user_id);

create policy "Users can update own credits"
  on credits for update
  using (auth.uid() = user_id);

-- Webhooks
create policy "Users can view own webhooks"
  on webhooks for select
  using (merchant_id in (select id from merchants where user_id = auth.uid()));

create policy "Users can insert webhooks"
  on webhooks for insert
  with check (merchant_id in (select id from merchants where user_id = auth.uid()));

create policy "Users can update own webhooks"
  on webhooks for update
  using (merchant_id in (select id from merchants where user_id = auth.uid()));

create policy "Users can delete own webhooks"
  on webhooks for delete
  using (merchant_id in (select id from merchants where user_id = auth.uid()));

-- API Keys
create policy "Users can view own api keys"
  on api_keys for select
  using (auth.uid() = user_id);

create policy "Users can insert api keys"
  on api_keys for insert
  with check (auth.uid() = user_id);

create policy "Users can update own api keys"
  on api_keys for update
  using (auth.uid() = user_id);

create policy "Users can delete own api keys"
  on api_keys for delete
  using (auth.uid() = user_id);

-- 8. AUTO-CREATE CREDITS ON USER SIGNUP
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.credits (user_id, balance, used, plan)
  values (new.id, 10, 0, 'free');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
