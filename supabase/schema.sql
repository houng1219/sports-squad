-- ============================================================
-- Sports Squad - Supabase Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- Tables
-- ============================================================

-- User profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text not null default '',
  phone text,
  avatar_url text,
  city text not null default '',
  district text,
  preferred_sports text[] not null default '{}',
  skill_level text not null default 'all' check (skill_level in ('beginner', 'intermediate', 'advanced', 'all')),
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Squads (揪團)
create table public.squads (
  id uuid not null default uuid_generate_v4(),
  title text not null,
  description text,
  sport text not null check (sport in (
    'basketball','badminton','running','football','tennis',
    'volleyball','baseball','swimming','cycling','boxing','other'
  )),
  city text not null,
  district text,
  location_detail text not null,
  latitude double precision,
  longitude double precision,
  scheduled_at timestamptz not null,
  duration_minutes int not null default 120,
  max_participants int not null default 10,
  min_age int,
  max_age int,
  skill_level text not null default 'all' check (skill_level in ('beginner', 'intermediate', 'advanced', 'all')),
  price_per_person int not null default 0,
  equipment text,
  notes text,
  status text not null default 'open' check (status in ('open', 'full', 'cancelled')),
  organizer_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_max_participants check (max_participants >= 2),
  constraint valid_duration check (duration_minutes >= 15)
);

-- Participation records
create table public.participations (
  id uuid not null default uuid_generate_v4(),
  squad_id uuid not null references public.squads(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'confirmed' check (status in ('confirmed', 'pending', 'cancelled')),
  joined_at timestamptz not null default now(),
  unique (squad_id, user_id)
);

-- ============================================================
-- Indexes
-- ============================================================

create index idx_squads_sport on public.squads(sport);
create index idx_squads_city on public.squads(city);
create index idx_squads_scheduled_at on public.squads(scheduled_at);
create index idx_squads_status on public.squads(status);
create index idx_squads_organizer on public.squads(organizer_id);
create index idx_participations_squad on public.participations(squad_id);
create index idx_participations_user on public.participations(user_id);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.squads enable row level security;
alter table public.participations enable row level security;

-- Profiles: anyone can read, only own can update
create policy "Profiles are publicly readable" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Squads: publicly readable, authenticated users can create, only organizers can update/delete
create policy "Squads are publicly readable" on public.squads
  for select using (true);

create policy "Authenticated users can create squads" on public.squads
  for insert with check (auth.role() = 'authenticated');

create policy "Organizers can update own squads" on public.squads
  for update using (auth.uid() = organizer_id);

create policy "Organizers can delete own squads" on public.squads
  for delete using (auth.uid() = organizer_id);

-- Participations: publicly readable, authenticated users can join/leave
create policy "Participations are publicly readable" on public.participations
  for select using (true);

create policy "Authenticated users can join squads" on public.participations
  for insert with check (auth.role() = 'authenticated');

create policy "Users can cancel own participation" on public.participations
  for update using (auth.uid() = user_id);

-- ============================================================
-- Functions & Triggers
-- ============================================================

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger squads_updated_at
  before update on public.squads
  for each row execute function public.handle_updated_at();

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();