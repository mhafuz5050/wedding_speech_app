create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  speech_id uuid not null references speeches (id) on delete cascade,
  stripe_session_id text not null unique,
  amount_pence integer not null,
  currency text not null,
  status text not null,
  created_at timestamptz not null default now()
);

alter table payments enable row level security;

create policy "users can read their own payments"
  on payments
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Payments are written only by the verified Stripe webhook (service
-- role), never by the client — so there is no insert/update policy here.
