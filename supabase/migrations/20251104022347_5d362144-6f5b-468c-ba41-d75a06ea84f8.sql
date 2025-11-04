-- Enable RLS on migrations_log (was missing)
alter table public.migrations_log enable row level security;

-- Allow anyone to read migrations_log (not sensitive data)
create policy "migrations_log_readable" on public.migrations_log
  for select using (true);