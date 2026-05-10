-- ============================================
-- Traveloop — Row Level Security Policies
-- Run AFTER schema.sql
-- ============================================

-- Enable RLS on all tables
alter table public.profiles       enable row level security;
alter table public.trips           enable row level security;
alter table public.stops           enable row level security;
alter table public.activities      enable row level security;
alter table public.budget_items    enable row level security;
alter table public.checklist_items enable row level security;
alter table public.notes           enable row level security;
alter table public.cities          enable row level security;

-- ──────────────────────────────────────────────
-- Helper: check if current user is admin
-- ──────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ══════════════════════════════════════════════
-- PROFILES
-- ══════════════════════════════════════════════
create policy "Profiles: owner select"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "Profiles: owner update"
  on public.profiles for update
  using (id = auth.uid());

create policy "Profiles: owner insert"
  on public.profiles for insert
  with check (id = auth.uid());

-- ══════════════════════════════════════════════
-- TRIPS
-- ══════════════════════════════════════════════
create policy "Trips: owner select"
  on public.trips for select
  using (
    user_id = auth.uid()
    or is_public = true
    or public.is_admin()
  );

create policy "Trips: owner insert"
  on public.trips for insert
  with check (user_id = auth.uid());

create policy "Trips: owner update"
  on public.trips for update
  using (user_id = auth.uid());

create policy "Trips: owner delete"
  on public.trips for delete
  using (user_id = auth.uid());

-- ══════════════════════════════════════════════
-- STOPS  (owner = trip owner)
-- ══════════════════════════════════════════════
create policy "Stops: owner select"
  on public.stops for select
  using (
    exists (
      select 1 from public.trips
      where trips.id = stops.trip_id
        and (trips.user_id = auth.uid() or trips.is_public = true)
    )
    or public.is_admin()
  );

create policy "Stops: owner insert"
  on public.stops for insert
  with check (
    exists (
      select 1 from public.trips
      where trips.id = stops.trip_id and trips.user_id = auth.uid()
    )
  );

create policy "Stops: owner update"
  on public.stops for update
  using (
    exists (
      select 1 from public.trips
      where trips.id = stops.trip_id and trips.user_id = auth.uid()
    )
  );

create policy "Stops: owner delete"
  on public.stops for delete
  using (
    exists (
      select 1 from public.trips
      where trips.id = stops.trip_id and trips.user_id = auth.uid()
    )
  );

-- ══════════════════════════════════════════════
-- ACTIVITIES  (owner = trip owner via stop)
-- ══════════════════════════════════════════════
create policy "Activities: owner select"
  on public.activities for select
  using (
    exists (
      select 1 from public.stops
      join public.trips on trips.id = stops.trip_id
      where stops.id = activities.stop_id
        and (trips.user_id = auth.uid() or trips.is_public = true)
    )
    or public.is_admin()
  );

create policy "Activities: owner insert"
  on public.activities for insert
  with check (
    exists (
      select 1 from public.stops
      join public.trips on trips.id = stops.trip_id
      where stops.id = activities.stop_id and trips.user_id = auth.uid()
    )
  );

create policy "Activities: owner update"
  on public.activities for update
  using (
    exists (
      select 1 from public.stops
      join public.trips on trips.id = stops.trip_id
      where stops.id = activities.stop_id and trips.user_id = auth.uid()
    )
  );

create policy "Activities: owner delete"
  on public.activities for delete
  using (
    exists (
      select 1 from public.stops
      join public.trips on trips.id = stops.trip_id
      where stops.id = activities.stop_id and trips.user_id = auth.uid()
    )
  );

-- ══════════════════════════════════════════════
-- BUDGET ITEMS
-- ══════════════════════════════════════════════
create policy "Budget: owner select"
  on public.budget_items for select
  using (
    exists (
      select 1 from public.trips
      where trips.id = budget_items.trip_id
        and (trips.user_id = auth.uid() or trips.is_public = true)
    )
    or public.is_admin()
  );

create policy "Budget: owner insert"
  on public.budget_items for insert
  with check (
    exists (
      select 1 from public.trips
      where trips.id = budget_items.trip_id and trips.user_id = auth.uid()
    )
  );

create policy "Budget: owner update"
  on public.budget_items for update
  using (
    exists (
      select 1 from public.trips
      where trips.id = budget_items.trip_id and trips.user_id = auth.uid()
    )
  );

create policy "Budget: owner delete"
  on public.budget_items for delete
  using (
    exists (
      select 1 from public.trips
      where trips.id = budget_items.trip_id and trips.user_id = auth.uid()
    )
  );

-- ══════════════════════════════════════════════
-- CHECKLIST ITEMS
-- ══════════════════════════════════════════════
create policy "Checklist: owner select"
  on public.checklist_items for select
  using (
    exists (
      select 1 from public.trips
      where trips.id = checklist_items.trip_id
        and (trips.user_id = auth.uid() or trips.is_public = true)
    )
    or public.is_admin()
  );

create policy "Checklist: owner insert"
  on public.checklist_items for insert
  with check (
    exists (
      select 1 from public.trips
      where trips.id = checklist_items.trip_id and trips.user_id = auth.uid()
    )
  );

create policy "Checklist: owner update"
  on public.checklist_items for update
  using (
    exists (
      select 1 from public.trips
      where trips.id = checklist_items.trip_id and trips.user_id = auth.uid()
    )
  );

create policy "Checklist: owner delete"
  on public.checklist_items for delete
  using (
    exists (
      select 1 from public.trips
      where trips.id = checklist_items.trip_id and trips.user_id = auth.uid()
    )
  );

-- ══════════════════════════════════════════════
-- NOTES
-- ══════════════════════════════════════════════
create policy "Notes: owner select"
  on public.notes for select
  using (
    exists (
      select 1 from public.trips
      where trips.id = notes.trip_id
        and (trips.user_id = auth.uid() or trips.is_public = true)
    )
    or public.is_admin()
  );

create policy "Notes: owner insert"
  on public.notes for insert
  with check (
    exists (
      select 1 from public.trips
      where trips.id = notes.trip_id and trips.user_id = auth.uid()
    )
  );

create policy "Notes: owner update"
  on public.notes for update
  using (
    exists (
      select 1 from public.trips
      where trips.id = notes.trip_id and trips.user_id = auth.uid()
    )
  );

create policy "Notes: owner delete"
  on public.notes for delete
  using (
    exists (
      select 1 from public.trips
      where trips.id = notes.trip_id and trips.user_id = auth.uid()
    )
  );

-- ══════════════════════════════════════════════
-- CITIES (public read, no write via API)
-- ══════════════════════════════════════════════
create policy "Cities: public read"
  on public.cities for select
  using (true);

-- Admin-only write for cities
create policy "Cities: admin insert"
  on public.cities for insert
  with check (public.is_admin());

create policy "Cities: admin update"
  on public.cities for update
  using (public.is_admin());

create policy "Cities: admin delete"
  on public.cities for delete
  using (public.is_admin());
