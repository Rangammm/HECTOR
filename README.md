# 🤖 HECTOR

## AI-Powered Intelligent Assistant System — Odoo Hackathon 2026

HECTOR is a modular, AI-driven assistant platform built to automate, streamline, and intelligently manage business operations. It replaces fragmented manual workflows with a unified, real-time, easy-to-use intelligent system — built for scale.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js / Vite |
| Backend | Node.js / Python |
| Database | PostgreSQL |
| Cache | Redis |
| AI/ML | Integrated AI APIs |
| DevOps | Docker, Docker Compose |
| Auth | JWT + OTP |

---

## ✨ Features Overview

| # | Feature | Description | Module |
|---|---|---|---|
| 1 | **User Authentication** | Secure signup, login, and session management | Auth Module |
| 2 | **OTP-Based Password Reset** | 6-digit numeric OTP via email, Redis-backed with TTL | Auth Module |
| 3 | **AI Dashboard** | Real-time KPIs, analytics, and smart filters | Dashboard |
| 4 | **Intelligent Query Engine** | Natural language processing for business queries | Core AI |
| 5 | **Automated Workflows** | Trigger-based task automation across modules | Workflow Engine |
| 6 | **Data Management** | Create, update, delete, and search records | Data Module |
| 7 | **Multi-Warehouse / Location Support** | Manage operations across multiple locations | Core Module |
| 8 | **Stock / Inventory Tracking** | Real-time inventory with ledger audit trail | Inventory Module |
| 9 | **Receipts & Deliveries** | Incoming and outgoing stock with validation | Operations |
| 10 | **Internal Transfers** | Move resources between locations seamlessly | Operations |
| 11 | **Stock Adjustments** | Fix discrepancies with automatic ledger logging | Adjustments |
| 12 | **Low Stock Alerts** | Automated notifications when stock hits threshold | Alerts |
| 13 | **Role-Based Access** | Admin, Manager, Staff permissions | Access Control |
| 14 | **Stock Ledger** | Immutable, append-only audit trail of all operations | Ledger |
| 15 | **Smart Filters** | Dynamic, server-side filters across all modules | UI/Backend |

---

## 🗺️ Traceability Table

| Feature / Endpoint / View | Description |
|---|---|
| **Authentication** | Auth Module |
| User Signup | POST `/auth/signup` — Register new user |
| User Login | POST `/auth/login` — Returns JWT token |
| OTP Request | POST `/auth/request-reset-otp` — Sends 6-digit OTP |
| OTP Verify | POST `/auth/verify-reset-otp` — Validates OTP from Redis |
| Password Reset | POST `/auth/reset-password` — Resets using short-lived token |
| OTP Redis TTL | OTP hashed and stored with expiry, single-use |
| Rate Limiting | Rate-limit OTP requests to prevent abuse |
| **Dashboard** | Inventory / Operations Dashboard |
| KPI: Total Products | Displays real-time product count in stock |
| KPI: Low / Out of Stock | Flags items below reorder threshold |
| KPI: Pending Receipts | Count of incoming shipments awaiting validation |
| KPI: Pending Deliveries | Count of outgoing orders awaiting dispatch |
| KPI: Internal Transfers | Count of scheduled internal stock movements |
| Filter: By Document Type | Filter dashboard cards by receipt/delivery/transfer |
| Filter: By Status | Filter by pending/validated/cancelled |
| Filter: By Location | Filter by warehouse or sub-location |
| Filter: By Category | Filter by product category |
| **Product Management** | Core Module — Products |
| Create / Update Product | POST/PUT `/products` — Full CRUD on product catalog |
| Product Fields | Name, SKU/Code, Category, Unit of Measure, Initial Stock |
| Stock per Location | View availability across all warehouses |
| Reordering Rules | Auto-trigger alerts/orders when stock falls below min |
| GET /products | List all products with filters |
| POST /products | Create new product |
| PUT /products/:id | Update product details |
| **Receipts (Incoming Stock)** | Core Module — Receipts |
| Create Receipt | POST `/receipts` — New incoming shipment |
| Add Supplier & Products | Attach supplier and line items to receipt |
| Input Quantities | Enter received quantities per product |
| Validate Receipt | PUT `/receipts/:id/validate` — Increases stock on validate |
| **Delivery Orders (Outgoing Stock)** | Core Module — Deliveries |
| Create Delivery | POST `/deliveries` — New outgoing order |
| Pick / Pack Items | Mark items picked and packed for dispatch |
| Validate Delivery | PUT `/deliveries/:id/validate` — Decreases stock on validate |
| **Internal Transfers** | Core Module — Transfers |
| Create Transfer | POST `/transfers` — Move stock between locations |
| Complete Transfer | PUT `/transfers/:id/complete` — Stock total unchanged |
| Ledger Logging | Every transfer logged in stock ledger |
| **Stock Adjustments** | Core Module — Adjustments |
| Create Adjustment | POST `/adjustments` — Correct stock discrepancies |
| Select Product & Location | Choose item and its source location |
| Enter Counted Quantity | System calculates difference and updates |
| Log Adjustment | Immutable log entry created automatically |
| **Stock Ledger** | Audit Trail |
| Immutable Log | Every stock operation appended, never edited |
| Audit Trail | Full history for compliance and review |
| GET /ledger | Fetch ledger with date/product/location filters |
| **Backend Requirements** | Non-Functional |
| Transactional Updates | All stock changes wrapped in DB transactions |
| Atomic Stock Updates | Prevent race conditions on concurrent operations |
| Negative Stock Guard | System prevents stock going below zero unless forced |
| JWT Authentication | Stateless auth via signed tokens |
| Redis Caching | OTP storage, session caching, rate limiting |
| PostgreSQL | Relational data for all inventory and user records |
| Clear Error Messages | Human-readable errors on all API responses |
| Server-Side Filters | All filtering logic handled on backend, not frontend |

---

## ⚙️ Sequential Setup Guide

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 20.11.0+ |
| Python | 3.9+ |
| PostgreSQL | 13+ |
| Redis | 6+ |
| Docker Desktop | Latest (for Docker setup) |

---

### 🐳 Option A — Run with Docker (Recommended)

| Step | Command | Description |
|---|---|---|
| 1 | `git clone https://github.com/Rangammm/HECTOR.git` | Clone the repo |
| 2 | `cd HECTOR` | Enter project directory |
| 3 | `cp .env.example .env` | Create environment file |
| 4 | Edit `.env` with your values | Set DB, Redis, JWT secrets |
| 5 | `docker-compose up --build` | Build and start all services |
| 6 | Open `http://localhost:3000` | Access the frontend |
| 7 | Open `http://localhost:8000/docs` | Access API documentation |

**Rebuild specific service:**
```bash
docker-compose down
docker-compose build --no-cache frontend
docker-compose up
```

---

### 💻 Option B — Run Locally (Without Docker)

#### Step 1 — Clone & Configure

```bash
git clone https://github.com/Rangammm/HECTOR.git
cd HECTOR
cp .env.example .env
# Edit .env with your DB and Redis credentials
```

#### Step 2 — Backend Setup

| Step | Command |
|---|---|
| Enter backend folder | `cd Backend` |
| Create virtual environment | `python -m venv venv` |
| Activate (Windows CMD) | `venv\Scripts\activate.bat` |
| Activate (Windows PowerShell) | `.\venv\Scripts\Activate.ps1` |
| Activate (Mac/Linux) | `source venv/bin/activate` |
| Install dependencies | `pip install -r requirements.txt` |
| Run migrations & seed | `python seed_data.py` |
| Start backend server | `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000` |

**Set environment variables (Windows CMD):**
```bash
set DATABASE_URL=postgresql://user:password@localhost:5432/hector
set REDIS_URL=redis://localhost:6379/0
set SECRET_KEY=your-secret-key-here
```

**Set environment variables (Mac/Linux):**
```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/hector"
export REDIS_URL="redis://localhost:6379/0"
export SECRET_KEY="your-secret-key-here"
```

#### Step 3 — Frontend Setup

| Step | Command |
|---|---|
| Enter frontend folder | `cd Frontend` |
| Install dependencies | `npm install` |
| Set API URL (Mac/Linux) | `export NEXT_PUBLIC_BACKEND_URL="http://localhost:8000"` |
| Set API URL (Windows CMD) | `set NEXT_PUBLIC_BACKEND_URL=http://localhost:8000` |
| Start frontend server | `npm run dev` |

---

## 🌐 Access URLs

| Service | URL |
|---|---|
| Frontend App | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| Signup Page | http://localhost:3000/signup |
| Login Page | http://localhost:3000/login |
| Dashboard | http://localhost:3000/dashboard |

---

## 🔑 Sample Login Credentials

> After running `seed_data.py`, use these test accounts:

| Role | Email | Password |
|---|---|---|
| Admin | admin@hector.com | admin123 |
| Manager | manager@hector.com | manager123 |
| Staff | staff@hector.com | staff123 |

---

## 🗂️ Project Structure

```
HECTOR/
├── Backend/          # Python/Node.js API server
├── Frontend/         # React.js frontend app
├── src/              # Shared source / utilities
├── .env.example      # Environment variable template
├── .gitignore        # Git ignore rules
├── README.md         # This file
└── docker-compose.yml # Docker orchestration
```

---

## 🔐 Security Notes

| Rule | Detail |
|---|---|
| Never commit `.env` | Use `.env.example` as template |
| OTP is single-use | Invalidated immediately after verification |
| JWT expiry | Tokens expire — refresh required |
| Rate limiting | OTP and login endpoints are rate-limited |
| Atomic DB updates | All stock changes use transactions to prevent corruption |

---

## 👥 Contributors

Built with ❤️ for **Odoo Hackathon 2026**

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
