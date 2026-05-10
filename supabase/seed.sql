-- ============================================
-- Traveloop — Seed Data
-- Run AFTER schema.sql and rls.sql
-- ============================================

-- ══════════════════════════════════════════════
-- 1. CITIES (50+ entries)
-- ══════════════════════════════════════════════
insert into public.cities (name, country, region, flag_emoji, cost_index, popularity) values
  -- Asia
  ('Tokyo',        'Japan',        'Asia',    '🇯🇵', 3, 95),
  ('Kyoto',        'Japan',        'Asia',    '🇯🇵', 2, 82),
  ('Osaka',        'Japan',        'Asia',    '🇯🇵', 2, 75),
  ('Bangkok',      'Thailand',     'Asia',    '🇹🇭', 1, 90),
  ('Chiang Mai',   'Thailand',     'Asia',    '🇹🇭', 1, 68),
  ('Phuket',       'Thailand',     'Asia',    '🇹🇭', 1, 72),
  ('Singapore',    'Singapore',    'Asia',    '🇸🇬', 3, 88),
  ('Bali',         'Indonesia',    'Asia',    '🇮🇩', 1, 92),
  ('Mumbai',       'India',        'Asia',    '🇮🇳', 1, 70),
  ('Delhi',        'India',        'Asia',    '🇮🇳', 1, 65),
  ('Goa',          'India',        'Asia',    '🇮🇳', 1, 74),
  ('Jaipur',       'India',        'Asia',    '🇮🇳', 1, 60),
  ('Seoul',        'South Korea',  'Asia',    '🇰🇷', 2, 80),
  ('Hanoi',        'Vietnam',      'Asia',    '🇻🇳', 1, 63),
  ('Ho Chi Minh',  'Vietnam',      'Asia',    '🇻🇳', 1, 66),
  ('Kuala Lumpur', 'Malaysia',     'Asia',    '🇲🇾', 1, 62),
  -- Europe
  ('Paris',        'France',       'Europe',  '🇫🇷', 3, 97),
  ('Rome',         'Italy',        'Europe',  '🇮🇹', 2, 93),
  ('Barcelona',    'Spain',        'Europe',  '🇪🇸', 2, 91),
  ('Amsterdam',    'Netherlands',  'Europe',  '🇳🇱', 3, 85),
  ('Istanbul',     'Turkey',       'Europe',  '🇹🇷', 1, 83),
  ('Prague',       'Czech Republic','Europe', '🇨🇿', 1, 78),
  ('Lisbon',       'Portugal',     'Europe',  '🇵🇹', 2, 80),
  ('London',       'United Kingdom','Europe', '🇬🇧', 3, 96),
  ('Berlin',       'Germany',      'Europe',  '🇩🇪', 2, 79),
  ('Vienna',       'Austria',      'Europe',  '🇦🇹', 2, 76),
  ('Athens',       'Greece',       'Europe',  '🇬🇷', 1, 74),
  ('Santorini',    'Greece',       'Europe',  '🇬🇷', 2, 86),
  ('Budapest',     'Hungary',      'Europe',  '🇭🇺', 1, 73),
  ('Dubrovnik',    'Croatia',      'Europe',  '🇭🇷', 2, 71),
  ('Florence',     'Italy',        'Europe',  '🇮🇹', 2, 84),
  ('Zurich',       'Switzerland',  'Europe',  '🇨🇭', 3, 69),
  ('Edinburgh',    'United Kingdom','Europe', '🏴', 2, 67),
  ('Reykjavik',    'Iceland',      'Europe',  '🇮🇸', 3, 64),
  -- Middle East & Africa
  ('Dubai',        'UAE',          'Middle East','🇦🇪', 3, 89),
  ('Cairo',        'Egypt',        'Africa',  '🇪🇬', 1, 72),
  ('Cape Town',    'South Africa', 'Africa',  '🇿🇦', 1, 77),
  ('Marrakech',    'Morocco',      'Africa',  '🇲🇦', 1, 70),
  ('Nairobi',      'Kenya',        'Africa',  '🇰🇪', 1, 55),
  -- Americas
  ('New York',     'United States','North America','🇺🇸', 3, 98),
  ('Los Angeles',  'United States','North America','🇺🇸', 3, 85),
  ('Cancún',       'Mexico',       'North America','🇲🇽', 1, 78),
  ('Mexico City',  'Mexico',       'North America','🇲🇽', 1, 72),
  ('Toronto',      'Canada',       'North America','🇨🇦', 2, 74),
  ('Lima',         'Peru',         'South America','🇵🇪', 1, 60),
  ('Buenos Aires', 'Argentina',    'South America','🇦🇷', 1, 68),
  ('Rio de Janeiro','Brazil',      'South America','🇧🇷', 2, 82),
  ('Bogotá',       'Colombia',     'South America','🇨🇴', 1, 58),
  ('Cusco',        'Peru',         'South America','🇵🇪', 1, 65),
  -- Oceania
  ('Sydney',       'Australia',    'Oceania', '🇦🇺', 3, 87),
  ('Melbourne',    'Australia',    'Oceania', '🇦🇺', 3, 79),
  ('Auckland',     'New Zealand',  'Oceania', '🇳🇿', 2, 63),
  ('Queenstown',   'New Zealand',  'Oceania', '🇳🇿', 2, 70),
  -- Islands
  ('Maldives',     'Maldives',     'Asia',    '🇲🇻', 3, 88),
  ('Fiji',         'Fiji',         'Oceania', '🇫🇯', 2, 60),
  ('Havana',       'Cuba',         'Caribbean','🇨🇺', 1, 62);

-- ══════════════════════════════════════════════
-- 2. DEMO USER
-- ══════════════════════════════════════════════
-- NOTE: Create this user via Supabase Dashboard or Auth API:
--   email: demo@traveloop.in
--   password: Demo@1234
--
-- After creation, copy the user UUID and run:
--   update public.profiles set role = 'admin' where id = '<UUID>';
--
-- For local dev, you can use the service_role key to call:
--   supabase.auth.admin.createUser({ email, password, ... })
--
-- The trigger will auto-create the profile row.
-- Below we use a placeholder UUID — replace after creating the auth user.

-- Placeholder demo user UUID (replace with actual UUID from auth.users)
do $$
declare
  demo_uid uuid;
  trip1    uuid;
  trip2    uuid;
  trip3    uuid;
  stop1a   uuid;
  stop1b   uuid;
  stop1c   uuid;
  stop2a   uuid;
  stop2b   uuid;
  stop3a   uuid;
  stop3b   uuid;
  stop3c   uuid;
begin
  -------------------------------------------------------
  -- Get or create demo user profile
  -- The auth user must be created first via Supabase Auth.
  -- This block grabs the first admin or falls back.
  -------------------------------------------------------
  select id into demo_uid from auth.users where email = 'demo@traveloop.in' limit 1;

  if demo_uid is null then
    raise notice 'Demo auth user not found. Create user demo@traveloop.in via Supabase Auth first, then re-run this seed.';
    return;
  end if;

  -- Ensure admin role
  update public.profiles set role = 'admin', name = 'Demo Admin', bio = 'Traveloop demo account' where id = demo_uid;

  -------------------------------------------------------
  -- TRIP 1: Japan Explorer 🇯🇵
  -------------------------------------------------------
  trip1 := uuid_generate_v4();
  insert into public.trips (id, user_id, name, description, start_date, end_date, is_public, cover_url)
  values (trip1, demo_uid, 'Japan Explorer 🇯🇵',
    'Two-week journey through Japan — from Tokyo neon to Kyoto temples.',
    '2026-06-01', '2026-06-14', true,
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800');

  -- Stops
  stop1a := uuid_generate_v4();
  stop1b := uuid_generate_v4();
  stop1c := uuid_generate_v4();
  insert into public.stops (id, trip_id, city, country, flag_emoji, arrival_date, departure_date, order_index) values
    (stop1a, trip1, 'Tokyo',  'Japan', '🇯🇵', '2026-06-01', '2026-06-05', 0),
    (stop1b, trip1, 'Kyoto',  'Japan', '🇯🇵', '2026-06-05', '2026-06-10', 1),
    (stop1c, trip1, 'Osaka',  'Japan', '🇯🇵', '2026-06-10', '2026-06-14', 2);

  -- Activities
  insert into public.activities (stop_id, name, type, cost, duration, time_slot, description) values
    (stop1a, 'Shibuya Crossing Walk',      'Sightseeing', 0,    '1 hour',   'Morning',   'Witness the world''s busiest crossing'),
    (stop1a, 'Tsukiji Outer Market',        'Food',        25,   '2 hours',  'Morning',   'Fresh sushi and street food'),
    (stop1a, 'TeamLab Borderless',          'Culture',     30,   '3 hours',  'Afternoon', 'Immersive digital art museum'),
    (stop1a, 'Ramen Tasting Tour',          'Food',        40,   '2 hours',  'Evening',   'Try 4 styles of Tokyo ramen'),
    (stop1a, 'Meiji Shrine',                'Culture',     0,    '1.5 hours','Morning',   'Serene shrine in Harajuku forest'),
    (stop1a, 'Akihabara Electronics',       'Shopping',    100,  '3 hours',  'Afternoon', 'Anime and electronics district'),
    (stop1b, 'Fushimi Inari Shrine',        'Sightseeing', 0,    '3 hours',  'Morning',   'Thousands of vermillion torii gates'),
    (stop1b, 'Arashiyama Bamboo Grove',     'Sightseeing', 0,    '2 hours',  'Afternoon', 'Walk through towering bamboo'),
    (stop1b, 'Tea Ceremony Experience',     'Culture',     50,   '1.5 hours','Afternoon', 'Traditional matcha ceremony'),
    (stop1b, 'Nishiki Market',              'Food',        30,   '2 hours',  'Morning',   'Kyoto''s kitchen — 400-year-old market'),
    (stop1b, 'Kinkaku-ji Golden Pavilion',  'Sightseeing', 5,    '1 hour',   'Morning',   'Iconic gold-leaf temple'),
    (stop1c, 'Dotonbori Street Food',       'Food',        20,   '2 hours',  'Evening',   'Takoyaki, okonomiyaki and more'),
    (stop1c, 'Osaka Castle',                'Sightseeing', 8,    '2 hours',  'Morning',   'Historic castle with panoramic views'),
    (stop1c, 'Universal Studios Japan',     'Adventure',   80,   'Full day', 'All Day',   'Theme park with Nintendo World');

  -- Budget
  insert into public.budget_items (trip_id, category, description, amount) values
    (trip1, 'Transport',      'Round-trip flights', 850),
    (trip1, 'Transport',      'JR Pass 14-day',     450),
    (trip1, 'Accommodation',  'Hotels (13 nights)', 1300),
    (trip1, 'Food',           'Daily food budget',   700),
    (trip1, 'Activities',     'Entry fees & tours',  350),
    (trip1, 'Shopping',       'Souvenirs',           200);

  -- Checklist
  insert into public.checklist_items (trip_id, item_name, category, is_packed) values
    (trip1, 'Passport',            'Documents',    true),
    (trip1, 'JR Pass printout',    'Documents',    true),
    (trip1, 'Travel insurance',    'Documents',    false),
    (trip1, 'Power adapter (A/B)', 'Electronics',  false),
    (trip1, 'Portable WiFi',       'Electronics',  true),
    (trip1, 'Comfortable shoes',   'Clothing',     false),
    (trip1, 'Rain jacket',         'Clothing',     false),
    (trip1, 'Sunscreen',           'Toiletries',   false);

  -- Notes
  insert into public.notes (trip_id, stop_id, content) values
    (trip1, stop1a, 'Don''t forget to get a Suica card at Narita airport for easy transit.'),
    (trip1, stop1b, 'Book the tea ceremony at least 3 days in advance.'),
    (trip1, null,   'Overall budget looks good. Consider adding a day trip to Nara.');

  -------------------------------------------------------
  -- TRIP 2: European Highlights 🇪🇺
  -------------------------------------------------------
  trip2 := uuid_generate_v4();
  insert into public.trips (id, user_id, name, description, start_date, end_date, is_public, cover_url)
  values (trip2, demo_uid, 'European Highlights 🇪🇺',
    'A whirlwind tour of Europe''s most iconic cities.',
    '2026-07-10', '2026-07-24', true,
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800');

  stop2a := uuid_generate_v4();
  stop2b := uuid_generate_v4();
  insert into public.stops (id, trip_id, city, country, flag_emoji, arrival_date, departure_date, order_index) values
    (stop2a, trip2, 'Paris',     'France', '🇫🇷', '2026-07-10', '2026-07-17', 0),
    (stop2b, trip2, 'Barcelona', 'Spain',  '🇪🇸', '2026-07-17', '2026-07-24', 1);

  insert into public.activities (stop_id, name, type, cost, duration, time_slot, description) values
    (stop2a, 'Eiffel Tower Summit',      'Sightseeing', 26,  '2 hours',  'Morning',   'Skip-the-line to the top'),
    (stop2a, 'Louvre Museum',             'Culture',     17,  '4 hours',  'Afternoon', 'Mona Lisa and beyond'),
    (stop2a, 'Seine River Cruise',        'Sightseeing', 15,  '1 hour',   'Evening',   'Sunset cruise past landmarks'),
    (stop2a, 'Montmartre Food Walk',      'Food',        55,  '3 hours',  'Morning',   'Cheese, wine & pastry tasting'),
    (stop2a, 'Le Marais Shopping',        'Shopping',    100, '3 hours',  'Afternoon', 'Vintage shops & boutiques'),
    (stop2b, 'Sagrada Familia',           'Sightseeing', 26,  '2 hours',  'Morning',   'Gaudí''s unfinished masterpiece'),
    (stop2b, 'Park Güell',               'Sightseeing', 10,  '2 hours',  'Afternoon', 'Mosaic terraces & city views'),
    (stop2b, 'La Boqueria Market',        'Food',        20,  '1.5 hours','Morning',   'Famous food market on La Rambla'),
    (stop2b, 'Flamenco Show',             'Culture',     40,  '1.5 hours','Evening',   'Authentic tablao performance'),
    (stop2b, 'Beach & Barceloneta',       'Adventure',   0,   '3 hours',  'Afternoon', 'Mediterranean beach time');

  insert into public.budget_items (trip_id, category, description, amount) values
    (trip2, 'Transport',     'Flights + Eurostar',  600),
    (trip2, 'Accommodation', 'Hotels (14 nights)',   1800),
    (trip2, 'Food',          'Daily food',           900),
    (trip2, 'Activities',    'Museums & tours',      300);

  insert into public.checklist_items (trip_id, item_name, category, is_packed) values
    (trip2, 'Passport',             'Documents',   true),
    (trip2, 'EU travel adapter',    'Electronics', false),
    (trip2, 'Sunglasses',           'Accessories', false),
    (trip2, 'Daypack',              'Bags',        true);

  insert into public.notes (trip_id, stop_id, content) values
    (trip2, stop2a, 'Book Eiffel Tower tickets 60 days in advance!'),
    (trip2, stop2b, 'Get the T-Casual metro card for 10 trips.');

  -------------------------------------------------------
  -- TRIP 3: Southeast Asia Backpacking 🌏
  -------------------------------------------------------
  trip3 := uuid_generate_v4();
  insert into public.trips (id, user_id, name, description, start_date, end_date, is_public, cover_url)
  values (trip3, demo_uid, 'Southeast Asia Backpacking 🌏',
    'Budget-friendly backpacking through Thailand, Vietnam, and Bali.',
    '2026-09-01', '2026-09-21', false,
    'https://images.unsplash.com/photo-1552465011-98bc40b82db8?w=800');

  stop3a := uuid_generate_v4();
  stop3b := uuid_generate_v4();
  stop3c := uuid_generate_v4();
  insert into public.stops (id, trip_id, city, country, flag_emoji, arrival_date, departure_date, order_index) values
    (stop3a, trip3, 'Bangkok',   'Thailand',  '🇹🇭', '2026-09-01', '2026-09-07', 0),
    (stop3b, trip3, 'Hanoi',     'Vietnam',   '🇻🇳', '2026-09-07', '2026-09-14', 1),
    (stop3c, trip3, 'Bali',      'Indonesia', '🇮🇩', '2026-09-14', '2026-09-21', 2);

  insert into public.activities (stop_id, name, type, cost, duration, time_slot, description) values
    (stop3a, 'Grand Palace',              'Sightseeing', 15,  '3 hours',  'Morning',   'Thailand''s most sacred site'),
    (stop3a, 'Khao San Road',             'Food',        5,   '2 hours',  'Evening',   'Street food paradise'),
    (stop3a, 'Floating Market',           'Culture',     12,  '4 hours',  'Morning',   'Damnoen Saduak market'),
    (stop3a, 'Thai Cooking Class',        'Food',        35,  '3 hours',  'Afternoon', 'Learn pad thai & green curry'),
    (stop3a, 'Muay Thai Match',           'Culture',     30,  '3 hours',  'Evening',   'Live boxing at Rajadamnern'),
    (stop3b, 'Ha Long Bay Cruise',        'Adventure',   85,  'Full day', 'All Day',   'Overnight cruise through limestone karsts'),
    (stop3b, 'Old Quarter Walking Tour',  'Sightseeing', 0,   '3 hours',  'Morning',   'French-colonial and Vietnamese architecture'),
    (stop3b, 'Pho Tasting',              'Food',        3,   '1 hour',   'Morning',   'The best pho in Hanoi'),
    (stop3b, 'Water Puppet Show',         'Culture',     5,   '1 hour',   'Evening',   'Traditional Vietnamese performance'),
    (stop3c, 'Tegallalang Rice Terraces', 'Sightseeing', 5,   '2 hours',  'Morning',   'Iconic green terraces'),
    (stop3c, 'Ubud Monkey Forest',        'Adventure',   5,   '2 hours',  'Afternoon', 'Sacred monkey sanctuary'),
    (stop3c, 'Sunset at Tanah Lot',       'Sightseeing', 3,   '2 hours',  'Evening',   'Sea temple at sunset'),
    (stop3c, 'Balinese Massage',          'Adventure',   15,  '1.5 hours','Afternoon', 'Traditional healing spa'),
    (stop3c, 'Seminyak Beach Club',       'Adventure',   25,  '4 hours',  'Afternoon', 'Day pass with pool & cocktails');

  insert into public.budget_items (trip_id, category, description, amount) values
    (trip3, 'Transport',     'Flights (multi-city)', 500),
    (trip3, 'Accommodation', 'Hostels & guesthouses', 420),
    (trip3, 'Food',          'Street food budget',    250),
    (trip3, 'Activities',    'Tours & entry fees',    200),
    (trip3, 'Transport',     'Local transit',          80);

  insert into public.checklist_items (trip_id, item_name, category, is_packed) values
    (trip3, 'Passport',             'Documents',   true),
    (trip3, 'Vaccination records',  'Documents',   false),
    (trip3, 'Bug spray',            'Toiletries',  false),
    (trip3, 'Dry bag',              'Gear',        false),
    (trip3, 'Flip flops',           'Clothing',    true),
    (trip3, 'Quick-dry towel',      'Gear',        false);

  insert into public.notes (trip_id, stop_id, content) values
    (trip3, stop3a, 'Avoid tuk-tuk scams near Grand Palace. Use Grab app instead.'),
    (trip3, stop3b, 'Book Ha Long cruise at least a week early — sells out fast.'),
    (trip3, stop3c, 'Rent a scooter in Ubud for ₹200/day. International license needed.');

end $$;

-- ══════════════════════════════════════════════
-- 3. ADDITIONAL ACTIVITIES (catalog of popular activities by city)
-- These are extra standalone activities for the cities table search
-- ══════════════════════════════════════════════
-- (Already seeded via the demo trips above. Additional activities
--  can be added to a separate "activity_templates" table in future.)
