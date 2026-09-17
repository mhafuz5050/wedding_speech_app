create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "users can read their own profile"
  on profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Profiles are written only by the server (service role), never directly
-- by a client, so there is no insert/update policy for anon/authenticated.

create table if not exists speeches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  speech_type text not null,
  answers jsonb not null,
  content text not null,
  sections jsonb not null,
  status text not null default 'generated'
    check (status in ('draft', 'generated', 'paid')),
  plan text not null default 'none'
    check (plan in ('none', 'standard', 'premium')),
  revisions_used integer not null default 0,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

alter table speeches enable row level security;

create policy "users can read their own speeches"
  on speeches
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Speeches are written and marked paid only by the server (service role
-- generation route now, the verified Stripe webhook later) — never from
-- the client directly, so there is no insert/update policy here.

create table if not exists usage_limits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles (id) on delete cascade,
  ip_hash text,
  date date not null,
  generations_count integer not null default 0
);

create unique index if not exists usage_limits_user_date_idx
  on usage_limits (user_id, date)
  where user_id is not null;

create unique index if not exists usage_limits_ip_date_idx
  on usage_limits (ip_hash, date)
  where ip_hash is not null;

alter table usage_limits enable row level security;

-- No policies: usage limits are internal bookkeeping, read and written
-- only by the server via the service role, which bypasses RLS.

create table if not exists generation_logs (
  id uuid primary key default gen_random_uuid(),
  speech_id uuid not null references speeches (id) on delete cascade,
  input_tokens integer not null,
  output_tokens integer not null,
  created_at timestamptz not null default now()
);

alter table generation_logs enable row level security;

-- No policies: internal cost-tracking, service role only.
