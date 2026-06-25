-- ============================================================
-- Bayar.Click — AI Agent Migration
-- SOUL.md & PROFILE.md Support
-- Execute: Supabase SQL Editor
-- ============================================================

-- 1. AI AGENT CONFIGS table
create table if not exists ai_agent_configs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  
  -- Basic config
  status text not null default 'off' check (status in ('on', 'off')),
  nomor_wa text,
  pesan_sapaan text default 'Halo! Ada yang bisa dibantu?',
  jam_buka text default '08:00',
  jam_tutup text default '17:00',
  hari_operasional text[] default '{sen,sel,rab,kam,jum}',
  auto_reply_offline text default 'Maaf, kami sedang offline. Terima kasih! 🙏',
  
  -- AI Personality (SOUL.md & PROFILE.md)
  soul_md text,
  profile_md text,
  
  -- Metadata
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Indexes
create index idx_ai_agent_configs_user_id on ai_agent_configs(user_id);
create index idx_ai_agent_configs_status on ai_agent_configs(status);

-- 3. Auto-update trigger
create trigger update_ai_agent_configs_updated_at
  before update on ai_agent_configs
  for each row execute function update_updated_at_column();

-- 4. RLS
alter table ai_agent_configs enable row level security;

create policy "Users can view own ai agent config"
  on ai_agent_configs for select
  using (auth.uid() = user_id);

create policy "Users can insert own ai agent config"
  on ai_agent_configs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own ai agent config"
  on ai_agent_configs for update
  using (auth.uid() = user_id);

create policy "Users can delete own ai agent config"
  on ai_agent_configs for delete
  using (auth.uid() = user_id);
