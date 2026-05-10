

## Enterprise Resource Planning (ERP) System for Traveloop — Odoo Hackathon 2026

HECTOR is a full-stack ERP platform purpose-built for travel trips. It centralizes and automates the core operations of a travel company — from booking management and customer tracking to invoicing, trip scheduling, and real-time analytics — replacing scattered spreadsheets and manual processes with one unified, intelligent system.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite) |
| Backend / Database | Supabase (PostgreSQL + Edge Functions) |
| Database Language | PLpgSQL (Stored Procedures & Triggers) |
| Auth | Supabase Auth (JWT) |
| Storage | Supabase Storage |
| Realtime | Supabase Realtime |
| Build Tool | Vite |

---

## ✨ Features Overview

| # | Feature | Description | Module |
|---|---|---|---|
| 1 | **User Authentication** | Secure login, signup, and role-based access via Supabase Auth | Auth |
| 2 | **ERP Dashboard** | Real-time KPIs — bookings, revenue, trips, and alerts | Dashboard |
| 3 | **Booking Management** | Create, update, cancel, and track travel bookings | Bookings |
| 4 | **Customer Management** | Full CRM — passenger profiles, history, and contacts | Customers |
| 5 | **Trip / Tour Management** | Define tours, destinations, pricing, and availability | Trips |
| 6 | **Package Management** | Bundle travel packages with seats, hotels, and pricing | Packages |
| 7 | **Invoice & Billing** | Auto-generate invoices, track payments, and dues | Finance |
| 8 | **Staff / HR Management** | Manage agents, guides, and internal team records | HR |
| 9 | **Inventory Tracking** | Monitor seats, rooms, vehicles, and available slots | Inventory |
| 10 | **Supplier Management** | Track hotels, airlines, and third-party vendors | Suppliers |
| 11 | **Real-Time Notifications** | Live updates for new bookings, cancellations, and alerts | Realtime |
| 12 | **Reports & Analytics** | Revenue trends, booking stats, and custom filters | Reports |
| 13 | **Role-Based Access** | Admin, Manager, Agent, and Staff permission levels | Access Control |
| 14 | **Audit Logs** | Immutable record of all operations for compliance | Logs |
| 15 | **Smart Filters** | Dynamic server-side filters across all modules | UI/Backend |

---

## 🗺️ Traceability Table

| Feature / Endpoint / View | Description |
|---|---|
| **Authentication** | Supabase Auth Module |
| User Signup | Supabase `auth.signUp()` — Register new user |
| User Login | Supabase `auth.signInWithPassword()` — Returns session token |
| Password Reset | Supabase `auth.resetPasswordForEmail()` — Email OTP reset |
| Session Management | JWT tokens auto-refreshed via Supabase client |
| Role Assignment | User roles stored in `profiles` table with RLS policies |
| **Dashboard** | ERP Overview |
| KPI: Total Bookings | Count of all active bookings in real-time |
| KPI: Revenue Today | Sum of confirmed payments for current date |
| KPI: Upcoming Trips | Count of tours scheduled in next 7 days |
| KPI: Pending Invoices | Count of unpaid/overdue invoices |
| KPI: New Customers | Newly registered customers this month |
| Filter: By Date Range | Filter dashboard data by custom date periods |
| Filter: By Agent | Filter by assigned travel agent |
| Filter: By Status | Filter by confirmed/pending/cancelled |
| **Booking Management** | Core Module — Bookings |
| Create Booking | Insert into `bookings` table with trip and customer ref |
| Update Booking | Modify booking details — dates, passengers, package |
| Cancel Booking | Soft-delete with status update and inventory release |
| Booking History | Full timeline of changes per booking |
| Assign Agent | Link a staff member to manage the booking |
| GET Bookings | Fetch bookings with filters (status, date, customer) |
| **Customer Management** | Core Module — Customers (CRM) |
| Add Customer | Create passenger profile with contact and passport info |
| Update Customer | Edit profile details |
| Customer History | View all past and upcoming bookings per customer |
| Search Customer | Search by name, email, or phone |
| **Trip / Tour Management** | Core Module — Trips |
| Create Trip | Define destination, dates, capacity, and pricing |
| Update Trip | Modify trip details or availability |
| Cancel Trip | Mark trip inactive and notify booked customers |
| Availability Check | Real-time seat/slot availability via Supabase Realtime |
| GET Trips | List all trips with filters by destination and date |
| **Package Management** | Core Module — Packages |
| Create Package | Bundle trips, hotels, and transport into one package |
| Update Package | Edit pricing, inclusions, and availability |
| Package Pricing | Support for single, couple, and group pricing tiers |
| **Invoice & Billing** | Finance Module |
| Generate Invoice | Auto-create invoice on booking confirmation |
| Mark as Paid | Update payment status and record payment method |
| Partial Payment | Record advance payments with outstanding balance |
| Overdue Alerts | Trigger notification for unpaid invoices past due date |
| GET Invoices | Fetch invoices filtered by status, date, and customer |
| **Staff / HR** | HR Module |
| Add Staff | Create employee profile with role and department |
| Assign Role | Set permissions — Admin, Manager, Agent, Staff |
| View Staff Activity | Audit log of actions performed by each staff member |
| **Inventory** | Inventory Module |
| Track Seats | Monitor available seats per trip in real-time |
| Track Rooms | Monitor hotel room availability per package |
| Update on Booking | Inventory auto-decrements on confirmed booking |
| Restore on Cancel | Inventory auto-restores on booking cancellation |
| **Supplier Management** | Suppliers Module |
| Add Supplier | Register hotel, airline, or transport vendor |
| Link to Package | Associate supplier services with travel packages |
| Track Contracts | Record pricing agreements per supplier |
| **Database (PLpgSQL)** | Supabase PostgreSQL |
| RLS Policies | Row Level Security enforced on all tables |
| Stored Procedures | Business logic in PLpgSQL for atomic operations |
| Triggers | Auto-update inventory and logs on data changes |
| Realtime Subscriptions | Live updates pushed to frontend via Supabase channels |
| **Non-Functional** | System Requirements |
| Atomic Updates | All critical changes wrapped in DB transactions |
| JWT Auth | Stateless session management via Supabase JWT |
| Role-Based RLS | Data access restricted per user role at DB level |
| Audit Trail | Every create/update/delete logged with timestamp and user |
| Server-Side Filters | All filter logic processed on Supabase, not client-side |

---

## ⚙️ Sequential Setup Guide

### Prerequisites

| Requirement | Version / Detail |
|---|---|
| Node.js | 18.0.0+ |
| npm | 9.0.0+ |
| Supabase Account | [supabase.com](https://supabase.com) — free tier works |
| Git | Latest |

---

### 🐳 Step-by-Step Setup

| Step | Action | Command / Detail |
|---|---|---|
| 1 | Clone the repository | `git clone https://github.com/Rangammm/HECTOR.git` |
| 2 | Enter project directory | `cd HECTOR` |
| 3 | Create environment file | `cp .env.example .env` |
| 4 | Add Supabase credentials | Edit `.env` — add your Project URL and Anon Key |
| 5 | Install frontend dependencies | `cd Frontend && npm install` |
| 6 | Run database migrations | Paste SQL from `src/` into Supabase SQL Editor |
| 7 | Start the frontend | `npm run dev` |
| 8 | Open the app | `http://localhost:5173` |

---

### 🔧 Supabase Configuration

**Step 1 — Create a Supabase project** at [supabase.com](https://supabase.com/dashboard)

**Step 2 — Get your credentials:**
- Go to **Project Settings → API**
- Copy **Project URL** and **anon / public key**

**Step 3 — Fill in your `.env` file:**
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Step 4 — Run the database schema:**
- Open **Supabase Dashboard → SQL Editor**
- Paste and run all `.sql` files from the `src/` folder in order

---

### 💻 Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

App runs at → `http://localhost:5173`

---

### 📁 Supabase (Backend) Setup

| Task | Where to do it |
|---|---|
| Create tables & schema | Supabase Dashboard → SQL Editor → run `src/` scripts |
| Set RLS policies | SQL Editor — included in `src/` scripts |
| Enable Realtime | Supabase Dashboard → Database → Replication |
| Configure Auth providers | Supabase Dashboard → Authentication → Providers |
| Deploy Edge Functions | Supabase Dashboard → Edge Functions |

---

## 🌐 Access URLs

| Service | URL |
|---|---|
| Frontend App | http://localhost:5173 |
| Supabase Dashboard | https://supabase.com/dashboard |
| Supabase REST API | https://your-project-id.supabase.co/rest/v1/ |
| Signup Page | http://localhost:5173/signup |
| Login Page | http://localhost:5173/login |
| Dashboard | http://localhost:5173/dashboard |

---

## 🔑 Sample Login Credentials

> Seed the database using the SQL scripts in `src/`, then log in with:

| Role | Email | Password |
|---|---|---|
| Admin | admin@hector.com | admin123 |
| Manager | manager@hector.com | manager123 |
| Agent | agent@hector.com | agent123 |

---

## 🗂️ Project Structure

```
HECTOR/
├── Backend/              # Supabase config, edge functions, helpers
├── Frontend/             # React.js + Vite application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route-level page components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Supabase client & utilities
│   ├── package.json
│   └── vite.config.js
├── src/                  # SQL schemas, RLS policies, seed data
├── .env.example          # Environment variable template
├── .gitignore
└── README.md
```

---

## 🔐 Security Notes

| Rule | Detail |
|---|---|
| Never commit `.env` | Use `.env.example` — real keys stay local only |
| Row Level Security | All Supabase tables protected by RLS policies |
| Role-based access | Admins, Managers, and Agents see only permitted data |
| JWT auto-refresh | Supabase handles token rotation automatically |
| Anon key is safe | Supabase anon key is public — RLS is the real security guard |

---

## 👥 Contributors

Built with ❤️ for **Odoo Hackathon 2026** by Team HECTOR

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
