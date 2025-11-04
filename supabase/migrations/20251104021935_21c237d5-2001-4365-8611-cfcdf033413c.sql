-- Enable necessary extensions
create extension if not exists "pgcrypto";

-- profiles table (synced with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  email text,
  role text default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- accounts (contas/caixas)
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  currency text default 'BRL',
  balance_cents bigint default 0,
  created_at timestamptz default now()
);

-- categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  type text check (type in ('income','expense','transfer')),
  created_at timestamptz default now()
);

-- uploads (raw files)
create table if not exists public.uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  filename text,
  storage_path text,
  file_type text,
  status text default 'uploaded',
  error text,
  created_at timestamptz default now()
);

-- transactions
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  account_id uuid references public.accounts(id),
  date date not null,
  description text,
  amount_cents bigint not null,
  currency text default 'BRL',
  category_id uuid references public.categories(id),
  external_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- bills (contas a pagar/receber)
create table if not exists public.bills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text,
  due_date date,
  amount_cents bigint,
  type text check (type in ('payable','receivable')),
  status text default 'open',
  created_at timestamptz default now()
);

-- reports (metadata for exports)
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  report_type text,
  storage_path text,
  created_at timestamptz default now()
);

-- migrations log
create table if not exists public.migrations_log (
  id serial primary key,
  name text,
  applied_at timestamptz default now()
);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.transactions enable row level security;
alter table public.accounts enable row level security;
alter table public.categories enable row level security;
alter table public.uploads enable row level security;
alter table public.bills enable row level security;
alter table public.reports enable row level security;

-- RLS Policies for profiles
create policy "profiles_view_own" on public.profiles
  for select using (id = auth.uid());

create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

-- RLS Policies for transactions
create policy "transactions_is_owner" on public.transactions
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- RLS Policies for accounts
create policy "accounts_is_owner" on public.accounts
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- RLS Policies for categories
create policy "categories_is_owner" on public.categories
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- RLS Policies for uploads
create policy "uploads_is_owner" on public.uploads
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- RLS Policies for bills
create policy "bills_is_owner" on public.bills
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- RLS Policies for reports
create policy "reports_is_owner" on public.reports
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Triggers for updated_at
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger transactions_updated_at
  before update on public.transactions
  for each row execute procedure public.handle_updated_at();