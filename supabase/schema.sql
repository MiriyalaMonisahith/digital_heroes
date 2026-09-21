-- Digital Heroes — Supabase schema
-- Run this once against a fresh Supabase project (SQL Editor -> New query -> paste -> Run).

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
create extension if not exists "pgcrypto";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================
create type user_role as enum ('subscriber', 'admin');
create type subscription_plan as enum ('monthly', 'yearly');
create type subscription_status as enum ('active', 'inactive', 'cancelled', 'lapsed');
create type donation_type as enum ('subscription_share', 'independent');
create type draw_status as enum ('draft', 'simulated', 'published');
create type draw_type as enum ('random', 'algorithmic');
create type match_tier as enum ('5', '4', '3');
create type winner_status as enum ('unverified', 'pending', 'approved', 'rejected', 'paid');

-- ============================================================================
-- TABLES
-- ============================================================================

-- One row per authenticated user, created automatically on signup (see trigger below).
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role user_role not null default 'subscriber',
  created_at timestamptz not null default now()
);

create table public.charities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  tagline text not null default '',
  description text not null default '',
  image_url text,
  website text,
  events jsonb not null default '[]'::jsonb,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  plan subscription_plan,
  status subscription_status not null default 'inactive',
  charity_id uuid references public.charities (id) on delete set null,
  charity_percentage numeric(5, 2) not null default 10 check (charity_percentage >= 10 and charity_percentage <= 100),
  started_at timestamptz,
  renews_at timestamptz,
  cancelled_at timestamptz,
  is_mock_payment boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  score smallint not null check (score >= 1 and score <= 45),
  played_on date not null,
  created_at timestamptz not null default now(),
  unique (user_id, played_on)
);

create table public.donations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  charity_id uuid not null references public.charities (id) on delete cascade,
  amount numeric(10, 2) not null,
  type donation_type not null,
  created_at timestamptz not null default now()
);

create table public.draws (
  id uuid primary key default gen_random_uuid(),
  month date not null unique,
  status draw_status not null default 'draft',
  draw_type draw_type not null default 'random',
  winning_numbers smallint[],
  entrant_count integer not null default 0,
  pool_total numeric(12, 2) not null default 0,
  pool_5 numeric(12, 2) not null default 0,
  pool_4 numeric(12, 2) not null default 0,
  pool_3 numeric(12, 2) not null default 0,
  jackpot_rollover_in numeric(12, 2) not null default 0,
  jackpot_rollover_out numeric(12, 2) not null default 0,
  simulated_at timestamptz,
  published_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.draw_entries (
  id uuid primary key default gen_random_uuid(),
  draw_id uuid not null references public.draws (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  numbers smallint[] not null,
  created_at timestamptz not null default now(),
  unique (draw_id, user_id)
);

create table public.draw_results (
  id uuid primary key default gen_random_uuid(),
  draw_id uuid not null references public.draws (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  match_tier match_tier,
  prize_amount numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  unique (draw_id, user_id)
);

create table public.winners (
  id uuid primary key default gen_random_uuid(),
  draw_result_id uuid not null unique references public.draw_results (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  proof_url text,
  status winner_status not null default 'unverified',
  submitted_at timestamptz,
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
create index scores_user_id_played_on_idx on public.scores (user_id, played_on desc);
create index draw_entries_draw_id_idx on public.draw_entries (draw_id);
create index draw_results_draw_id_idx on public.draw_results (draw_id);
create index winners_status_idx on public.winners (status);
create index subscriptions_status_idx on public.subscriptions (status);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- SECURITY DEFINER so it can read profiles.role even under a caller whose own
-- profile row RLS would otherwise hide from a naive subquery.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Creates a profile row automatically whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));

  insert into public.subscriptions (user_id)
  values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Keeps only the latest 5 scores per user: when a 6th is inserted, drop the oldest.
create or replace function public.trim_old_scores()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.scores
  where id in (
    select id from public.scores
    where user_id = new.user_id
    order by played_on desc, created_at desc
    offset 5
  );
  return new;
end;
$$;

create trigger trim_scores_after_insert
  after insert on public.scores
  for each row execute procedure public.trim_old_scores();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.charities enable row level security;
alter table public.subscriptions enable row level security;
alter table public.scores enable row level security;
alter table public.donations enable row level security;
alter table public.draws enable row level security;
alter table public.draw_entries enable row level security;
alter table public.draw_results enable row level security;
alter table public.winners enable row level security;

-- profiles
create policy "profiles: self read" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "profiles: self update" on public.profiles for update using (auth.uid() = id or public.is_admin());
create policy "profiles: admin insert" on public.profiles for insert with check (public.is_admin());

-- charities: public readable, admin-writable
create policy "charities: public read" on public.charities for select using (true);
create policy "charities: admin write" on public.charities for insert with check (public.is_admin());
create policy "charities: admin update" on public.charities for update using (public.is_admin());
create policy "charities: admin delete" on public.charities for delete using (public.is_admin());

-- subscriptions: owner + admin
create policy "subscriptions: owner read" on public.subscriptions for select using (auth.uid() = user_id or public.is_admin());
create policy "subscriptions: owner update" on public.subscriptions for update using (auth.uid() = user_id or public.is_admin());
create policy "subscriptions: admin insert" on public.subscriptions for insert with check (auth.uid() = user_id or public.is_admin());

-- scores: owner + admin
create policy "scores: owner read" on public.scores for select using (auth.uid() = user_id or public.is_admin());
create policy "scores: owner insert" on public.scores for insert with check (auth.uid() = user_id or public.is_admin());
create policy "scores: owner update" on public.scores for update using (auth.uid() = user_id or public.is_admin());
create policy "scores: owner delete" on public.scores for delete using (auth.uid() = user_id or public.is_admin());

-- donations: owner read (or null user_id = anonymous, admin-only visible), admin manages
create policy "donations: owner or admin read" on public.donations for select using (auth.uid() = user_id or public.is_admin());
create policy "donations: owner or admin insert" on public.donations for insert with check (auth.uid() = user_id or public.is_admin());

-- draws: published draws are public, drafts admin-only
create policy "draws: public read published" on public.draws for select using (status = 'published' or public.is_admin());
create policy "draws: admin write" on public.draws for insert with check (public.is_admin());
create policy "draws: admin update" on public.draws for update using (public.is_admin());

-- draw_entries: owner + admin
create policy "draw_entries: owner or admin read" on public.draw_entries for select using (auth.uid() = user_id or public.is_admin());
create policy "draw_entries: admin write" on public.draw_entries for insert with check (public.is_admin());

-- draw_results: owner + admin
create policy "draw_results: owner or admin read" on public.draw_results for select using (auth.uid() = user_id or public.is_admin());
create policy "draw_results: admin write" on public.draw_results for insert with check (public.is_admin());

-- winners: owner + admin
create policy "winners: owner or admin read" on public.winners for select using (auth.uid() = user_id or public.is_admin());
create policy "winners: owner update proof" on public.winners for update using (auth.uid() = user_id or public.is_admin());
create policy "winners: admin insert" on public.winners for insert with check (public.is_admin());

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('winner-proofs', 'winner-proofs', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('charity-images', 'charity-images', true)
on conflict (id) do nothing;

create policy "winner-proofs: owner or admin read"
  on storage.objects for select
  using (bucket_id = 'winner-proofs' and (owner = auth.uid() or public.is_admin()));

create policy "winner-proofs: owner upload"
  on storage.objects for insert
  with check (bucket_id = 'winner-proofs' and owner = auth.uid());

create policy "charity-images: public read"
  on storage.objects for select
  using (bucket_id = 'charity-images');

create policy "charity-images: admin write"
  on storage.objects for insert
  with check (bucket_id = 'charity-images' and public.is_admin());

create policy "charity-images: admin update"
  on storage.objects for update
  using (bucket_id = 'charity-images' and public.is_admin());
