<<<<<<< HEAD
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
=======

#  Odoo Hackathon 2026

An innovative smart solution developed for the Odoo Hackathon 2026 focused on solving real-world problems through automation, modern web technologies, and scalable architecture.

---

#  Project Overview

This project was created to provide an efficient and user-friendly platform that combines modern frontend development with backend automation and intelligent workflows. The system is designed to improve productivity, simplify operations, and deliver a smooth user experience with optimized performance.

The project demonstrates problem-solving skills, full-stack development knowledge, and the ability to build scalable applications suitable for real-world use cases.

---

#  Features & Benefits

| Feature                      | Benefit                                         |
| ---------------------------- | ----------------------------------------------- |
| Responsive User Interface    | Provides smooth experience across all devices   |
| Smart Automation Workflow    | Reduces manual work and increases efficiency    |
| Real-Time Data Processing    | Faster and more accurate system responses       |
| Secure Authentication System | Protects user data and improves security        |
| Scalable Architecture        | Supports future growth and feature expansion    |
| Optimized Performance        | Faster loading speed and better user experience |
| Clean Dashboard Design       | Easy navigation and improved usability          |
| Modular Code Structure       | Easier maintenance and development              |

---

#  Technologies Used

| Category   | Technologies          |
| ---------- | --------------------- |
| Frontend   | HTML, CSS, JavaScript |
| Backend    | Node.js / Python      |
| Database   | MongoDB / PostgreSQL  |
| Tools      | Git, GitHub, VS Code  |
| Deployment | Vercel / Render       |

---

#  Project Structure

| Folder/File    | Description                            |
| -------------- | -------------------------------------- |
| `/frontend`    | Contains frontend source code          |
| `/backend`     | Contains backend APIs and server logic |
| `/assets`      | Images, icons, and static resources    |
| `/components`  | Reusable UI components                 |
| `README.md`    | Project documentation                  |
| `package.json` | Dependencies and project configuration |

---

#  Installation Steps

## 1. Clone the Repository

```bash
git clone https://github.com/Rangammm/odoo-hackathon-2026.git
```

## 2. Navigate to Project Folder

```bash
cd odoo-hackathon-2026
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Start Development Server

```bash
npm start
```

## 5. Run Backend Server

```bash
npm run server
```

---

#  How the Project Works

The system allows users to interact with a modern web platform where requests are processed efficiently through backend services and automated workflows. Data is handled securely and displayed dynamically to provide a fast and seamless experience.

The architecture is designed to maintain scalability, making it easier to integrate future features and improvements.

---

#  Future Improvements

* AI-powered analytics and insights
* Enhanced dashboard and UI experience
* Cloud deployment optimization
* Advanced automation features
* Improved mobile responsiveness
* Better scalability and security enhancements



# 📜 License

This project is licensed under the MIT License.
>>>>>>> d14c8a1fbebcbac798946d4dada5b495c9565571
