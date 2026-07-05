-- Shared sync code MVP for Cyber Zdrowie / VitaTrack.
-- Prepared migration only. Do not run automatically from Codex.

create extension if not exists pgcrypto;

create table if not exists public.sync_spaces (
  id uuid primary key default gen_random_uuid(),
  code_hash text unique not null,
  label text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sync_entries (
  id uuid primary key default gen_random_uuid(),
  sync_space_id uuid not null references public.sync_spaces(id) on delete cascade,
  local_id text not null,
  entry_date text null,
  payload jsonb not null,
  source_device text null,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(sync_space_id, local_id)
);

create table if not exists public.sync_dishes (
  id uuid primary key default gen_random_uuid(),
  sync_space_id uuid not null references public.sync_spaces(id) on delete cascade,
  local_id text not null,
  payload jsonb not null,
  source_device text null,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(sync_space_id, local_id)
);

create index if not exists sync_entries_space_updated_idx
  on public.sync_entries(sync_space_id, updated_at)
  where deleted_at is null;

create index if not exists sync_entries_space_date_idx
  on public.sync_entries(sync_space_id, entry_date)
  where deleted_at is null;

create index if not exists sync_dishes_space_updated_idx
  on public.sync_dishes(sync_space_id, updated_at)
  where deleted_at is null;

alter table public.sync_spaces enable row level security;
alter table public.sync_entries enable row level security;
alter table public.sync_dishes enable row level security;

-- No anon/authenticated policies are created intentionally.
-- The shared-sync MVP must access these tables only through the cloud-sync
-- Edge Function using the server-side Supabase service role key.
