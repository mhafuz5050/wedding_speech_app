alter table speeches add column if not exists follow_up_sent_at timestamptz;
alter table profiles add column if not exists marketing_opt_out boolean not null default false;
