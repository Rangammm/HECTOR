-- ============================================
-- Traveloop — Database Schema
-- Run this FIRST in Supabase SQL Editor
-- ============================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ──────────────────────────────────────────────
-- PROFILES (extends auth.users)
-- ──────────────────────────────────────────────
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  avatar_url text,
  bio        text,
  role       text default 'user'
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ──────────────────────────────────────────────
-- TRIPS
-- ──────────────────────────────────────────────
create table public.trips (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  description text,
  start_date  date,
  end_date    date,
  cover_url   text,
  is_public   boolean default false,
  created_at  timestamptz default now()
);

-- ──────────────────────────────────────────────
-- STOPS
-- ──────────────────────────────────────────────
create table public.stops (
  id             uuid primary key default uuid_generate_v4(),
  trip_id        uuid references public.trips(id) on delete cascade not null,
  city           text not null,
  country        text,
  flag_emoji     text,
  arrival_date   date,
  departure_date date,
  order_index    int default 0
);

-- ──────────────────────────────────────────────
-- ACTIVITIES
-- ──────────────────────────────────────────────
create table public.activities (
  id          uuid primary key default uuid_generate_v4(),
  stop_id     uuid references public.stops(id) on delete cascade not null,
  name        text not null,
  type        text,
  cost        numeric default 0,
  duration    text,
  time_slot   text,
  description text
);

-- ──────────────────────────────────────────────
-- BUDGET ITEMS
-- ──────────────────────────────────────────────
create table public.budget_items (
  id          uuid primary key default uuid_generate_v4(),
  trip_id     uuid references public.trips(id) on delete cascade not null,
  category    text,
  description text,
  amount      numeric default 0
);

-- ──────────────────────────────────────────────
-- CHECKLIST ITEMS
-- ──────────────────────────────────────────────
create table public.checklist_items (
  id        uuid primary key default uuid_generate_v4(),
  trip_id   uuid references public.trips(id) on delete cascade not null,
  item_name text not null,
  category  text,
  is_packed boolean default false
);

-- ──────────────────────────────────────────────
-- NOTES
-- ──────────────────────────────────────────────
create table public.notes (
  id         uuid primary key default uuid_generate_v4(),
  trip_id    uuid references public.trips(id) on delete cascade not null,
  stop_id    uuid references public.stops(id) on delete set null,
  content    text,
  created_at timestamptz default now()
);

-- ──────────────────────────────────────────────
-- CITIES (reference / lookup)
-- ──────────────────────────────────────────────
create table public.cities (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  country    text not null,
  region     text,
  flag_emoji text,
  cost_index int check (cost_index between 1 and 3),
  popularity int check (popularity between 1 and 100)
);

-- Indexes for common queries
create index idx_trips_user    on public.trips(user_id);
create index idx_stops_trip    on public.stops(trip_id);
create index idx_activities_stop on public.activities(stop_id);
create index idx_budget_trip   on public.budget_items(trip_id);
create index idx_checklist_trip on public.checklist_items(trip_id);
create index idx_notes_trip    on public.notes(trip_id);
create index idx_cities_name   on public.cities(name);
create index idx_cities_region on public.cities(region);
