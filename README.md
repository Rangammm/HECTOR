# Traveloop — Backend Setup

## Prerequisites
- [Supabase](https://supabase.com) project (free tier works)
- Node.js 18+

## 1. Supabase Setup

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor** and run the files in order:

```
supabase/schema.sql   ← tables, triggers, indexes
supabase/rls.sql      ← row-level security policies
```

3. Create the demo user via **Authentication → Users → Add User**:
   - Email: `demo@traveloop.in`
   - Password: `Demo@1234`

4. Run the seed file:
```
supabase/seed.sql     ← cities, demo trips, activities
```

## 2. Environment Variables

Copy `.env.example` → `.env` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Find these in **Supabase Dashboard → Settings → API**.

## 3. Project Structure

```
supabase/
  schema.sql        # Database tables & triggers
  rls.sql           # Row-level security policies
  seed.sql          # 56 cities + 3 demo trips
src/lib/
  supabase.js       # Supabase client
  api.js            # All query functions
.env.example        # Env template
```

## 4. API Reference (`src/lib/api.js`)

| Domain    | Functions |
|-----------|-----------|
| Trips     | `getTrips(userId)` `getTripById(id)` `createTrip()` `updateTrip()` `deleteTrip()` |
| Stops     | `getStops(tripId)` `createStop()` `updateStop()` `deleteStop()` `reorderStops()` |
| Activities| `getActivities(stopId)` `createActivity()` `deleteActivity()` |
| Budget    | `getBudgetItems(tripId)` `createBudgetItem()` `deleteBudgetItem()` |
| Checklist | `getChecklist(tripId)` `addChecklistItem()` `toggleChecklistItem()` |
| Notes     | `getNotes(tripId)` `createNote()` `deleteNote()` |
| Cities    | `searchCities(query, region)` |
| Profile   | `getUserProfile(userId)` `updateProfile()` |

## 5. RLS Summary

| Table      | Owner R/W | Public Read | Admin Read All |
|------------|-----------|-------------|----------------|
| profiles   | ✅        | ❌          | ✅             |
| trips      | ✅        | if `is_public` | ✅          |
| stops      | ✅        | if trip public | ✅          |
| activities | ✅        | if trip public | ✅          |
| budget     | ✅        | if trip public | ✅          |
| checklist  | ✅        | if trip public | ✅          |
| notes      | ✅        | if trip public | ✅          |
| cities     | admin only| ✅          | ✅             |

## 6. Demo Account

| Field    | Value |
|----------|-------|
| Email    | `demo@traveloop.in` |
| Password | `Demo@1234` |
| Role     | `admin` |
| Trips    | Japan Explorer 🇯🇵, European Highlights 🇪🇺, SE Asia Backpacking 🌏 |
