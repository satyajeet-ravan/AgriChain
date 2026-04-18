# AgriChain - Project Summary

> **Last updated:** 2026-04-18

**Authors:** Rajgaurav Patil, Satyajeet Ravan, Shravan Patil, Parth Madrewar

---

## 1. Project Overview

**AgriChain** is a full-stack agricultural marketplace platform that connects Indian farmers directly with buyers, eliminating middlemen. The platform provides role-based dashboards for four user types -- Farmers, Buyers, Both (dual-role), and Admins -- with features including crop listing, ordering, analytics, fraud reporting, and platform administration.

All data is persisted in a PostgreSQL database hosted on Supabase with Row-Level Security (RLS) policies. Authentication is handled via Supabase Auth (GoTrue) with JWT tokens.

---

## 2. Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI library |
| React Router DOM v7 | Client-side routing with role-based guards |
| Vite | Build tool and dev server |
| Axios | HTTP client with token interceptors |
| Supabase JS Client | Auth session management on frontend |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express | HTTP server framework |
| Supabase JS Client | Database queries via PostgREST + Auth verification |
| dotenv | Environment variable loading |
| cors | Cross-origin resource sharing |

### Database & Auth
| Technology | Purpose |
|---|---|
| PostgreSQL (Supabase) | Relational database with RLS |
| Supabase Auth (GoTrue) | User authentication, JWT tokens, session management |

### Architecture
- **Pattern:** Microservice-style modular backend (9 service modules)
- **Auth:** JWT Bearer tokens via Supabase Auth with role-based access control
- **State:** React Context (AuthContext) for client-side auth state
- **Storage:** localStorage for JWT token persistence
- **Module System:** ES Modules (`"type": "module"`) in both frontend and backend
- **Database Access:** Supabase PostgREST with explicit FK hints for joins

---

## 3. Database Schema (for ER Diagram)

### 3.1 Tables

#### PROFILES
Stores user profile data. Linked to Supabase `auth.users` via shared UUID.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK, FK -> auth.users | User ID (matches auth user) |
| full_name | TEXT | nullable | Full name |
| email | TEXT | nullable | Email address |
| phone_no | TEXT | nullable | Phone number |
| address | TEXT | nullable | Location/address |
| role | ENUM | NOT NULL | `Farmer`, `Buyer`, `Both`, `Admin` |
| dob | DATE | nullable | Date of birth |
| verified | BOOLEAN | DEFAULT false | Admin-verified status |
| blocked | BOOLEAN | DEFAULT false | Admin-blocked status |
| created_at | TIMESTAMPTZ | DEFAULT now() | Account creation time |
| updated_at | TIMESTAMPTZ | DEFAULT now() | Last profile update |

#### CROP_VARIETY
Master list of crop varieties. Seeded with 60 entries.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK, DEFAULT gen_random_uuid() | Variety ID |
| category | ENUM | NOT NULL | `fruits`, `vegetables`, `grains`, `nuts`, `spices`, `processed` |
| sub_category | TEXT | NOT NULL | Sub-category (e.g., Cereals, Citrus) |
| variety | TEXT | NOT NULL | Variety name (e.g., Basmati Rice) |
| created_at | TIMESTAMP | DEFAULT now() | Creation time |

#### PRODUCTS
Crop listings created by farmers.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK, DEFAULT gen_random_uuid() | Product ID |
| farmer_id | UUID | FK -> profiles.id (constraint: fk_farmer) | Farmer who listed it |
| category | UUID | FK -> crop_variety.id | Crop variety reference |
| quantity | FLOAT8 | CHECK >= 0 | Available quantity |
| unit | TEXT | | Unit of measure (e.g., kg) |
| price_per_unit | NUMERIC | | Price per unit in INR |
| harvest_date | DATE | nullable | Harvest date |
| description | TEXT | nullable | Product description |
| image_url | TEXT | nullable | Product image URL |
| status | TEXT | DEFAULT 'available' | `available` or `unavailable` |
| featured | BOOLEAN | DEFAULT false | Show in landing page "Live Market Prices" |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation time |
| updated_at | TIMESTAMPTZ | DEFAULT now() | Last update time |

#### ORDERS
Purchase orders from buyers to farmers.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK, DEFAULT gen_random_uuid() | Order ID |
| farmer_id | UUID | FK -> profiles.id (constraint: fk_farmer) | Farmer receiving order |
| customer_id | UUID | FK -> profiles.id (constraint: fk_customers) | Buyer placing order |
| product_id | UUID | FK -> products.id (constraint: fk_products) | Product being ordered |
| quantity | INT4 | CHECK > 0 | Quantity ordered |
| price | NUMERIC | CHECK >= 0 | Total order price (computed) |
| status | ENUM | DEFAULT 'requested' | `requested`, `ongoing`, `accepted`, `rejected` |
| order_date | TIMESTAMP | DEFAULT now() | Order placement date |
| created_at | TIMESTAMP | DEFAULT now() | Creation time |
| updated_at | TIMESTAMP | nullable | Last update time |

#### FRAUD_REPORTS
User-submitted reports against other users.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK, DEFAULT gen_random_uuid() | Report ID |
| reporter_id | UUID | FK -> profiles.id (constraint: fk_reporter) | User who filed report |
| reported_user_id | UUID | FK -> profiles.id (constraint: fk_reported_user) | User being reported |
| type | TEXT | NOT NULL | `fraud`, `quality`, `payment`, `delivery` |
| description | TEXT | NOT NULL | Detailed description |
| severity | TEXT | DEFAULT 'medium', CHECK | `low`, `medium`, `high`, `critical` |
| status | TEXT | DEFAULT 'pending', CHECK | `pending`, `investigating`, `resolved`, `dismissed` |
| admin_notes | TEXT | nullable | Admin's notes on the report |
| created_at | TIMESTAMP | DEFAULT now() | Creation time |
| updated_at | TIMESTAMP | nullable | Last update time |

### 3.2 Entity Relationships (for ER Diagram)

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  CROP_VARIETY │       │   PROFILES   │       │FRAUD_REPORTS │
│──────────────│       │──────────────│       │──────────────│
│ id (PK)      │◄──┐   │ id (PK)      │◄──┬──│ reporter_id  │
│ category     │   │   │ full_name    │   │  │ reported_    │
│ sub_category │   │   │ email        │   │  │  user_id     │
│ variety      │   │   │ role         │   │  │ type         │
│ created_at   │   │   │ verified     │   │  │ severity     │
└──────────────┘   │   │ blocked      │   │  │ status       │
                   │   └──────┬───────┘   │  └──────────────┘
                   │          │           │
                   │   ┌──────┴───────┐   │
                   │   │   PRODUCTS   │   │
                   │   │──────────────│   │
                   └───│ category(FK) │   │
                       │ farmer_id   │───┘
                       │ quantity     │
                       │ price_per_   │
                       │  unit        │
                       │ status       │
                       │ featured     │
                       └──────┬───────┘
                              │
                       ┌──────┴───────┐
                       │    ORDERS    │
                       │──────────────│
                       │ product_id   │──► PRODUCTS
                       │ farmer_id    │──► PROFILES
                       │ customer_id  │──► PROFILES
                       │ quantity     │
                       │ price        │
                       │ status       │
                       └──────────────┘
```

**Relationships Summary:**
- **profiles (1) <---> (N) products** via `farmer_id` -- A farmer lists many products
- **crop_variety (1) <---> (N) products** via `category` -- Each product belongs to one variety
- **profiles (1) <---> (N) orders** via `farmer_id` -- A farmer receives many orders
- **profiles (1) <---> (N) orders** via `customer_id` -- A buyer places many orders
- **products (1) <---> (N) orders** via `product_id` -- A product can have many orders
- **profiles (1) <---> (N) fraud_reports** via `reporter_id` -- A user files many reports
- **profiles (1) <---> (N) fraud_reports** via `reported_user_id` -- A user can be reported many times

**Cardinalities:**
- profiles : products = 1 : N
- crop_variety : products = 1 : N
- profiles : orders = 1 : N (both as farmer and as customer)
- products : orders = 1 : N
- profiles : fraud_reports = 1 : N (both as reporter and reported)

### 3.3 Foreign Key Constraint Names
These are the actual PostgreSQL constraint names used in Supabase PostgREST joins:

| Constraint Name | Table | Column | References |
|---|---|---|---|
| fk_farmer | products | farmer_id | profiles.id |
| fk_farmer | orders | farmer_id | profiles.id |
| fk_customers | orders | customer_id | profiles.id |
| fk_products | orders | product_id | products.id |
| fk_reporter | fraud_reports | reporter_id | profiles.id |
| fk_reported_user | fraud_reports | reported_user_id | profiles.id |

### 3.4 Row-Level Security (RLS) Policies

#### PROFILES (RLS Enabled)
| Policy | Command | Rule |
|---|---|---|
| Anyone can view profiles | SELECT | true |
| Users can view own profile | SELECT | auth.uid() = id |
| Users can insert own profile | INSERT | auth.uid() = id |
| Users can update own profile | UPDATE | auth.uid() = id |
| Admins can update any profile | UPDATE | EXISTS(profile where id=auth.uid() AND role='Admin') |

#### PRODUCTS (RLS Enabled)
| Policy | Command | Rule |
|---|---|---|
| Public view products | SELECT | true |
| Farmers manage own products | ALL | role IN ('Farmer', 'Both') |
| Admin manage all products | ALL | role = 'Admin' |

#### ORDERS (RLS Disabled)
Access controlled via backend middleware (`verifyToken`, `requireRole`).

#### FRAUD_REPORTS (RLS Disabled)
Access controlled via backend middleware.

### 3.5 Database Migrations Applied
| Migration | Description |
|---|---|
| 20260412220520 | Add enum values (user roles, order status, crop categories) |
| 20260412220528 | Admin products RLS policy |
| 20260412220549 | Seed 60 crop varieties |
| 20260417120424 | Add verified and blocked columns to profiles |

---

## 4. System Architecture

### 4.1 High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│                   CLIENT (Browser)               │
│  React + Vite SPA                                │
│  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  AuthContext  │  │  Axios Client            │  │
│  │  (JWT state)  │  │  (Bearer token attached) │  │
│  └──────────────┘  └──────────┬───────────────┘  │
│                               │                  │
│  Supabase JS Client           │                  │
│  (session sync only)          │                  │
└───────────────────────────────┼──────────────────┘
                                │ HTTP (REST)
                                ▼
┌───────────────────────────────────────────────────┐
│              BACKEND (Express.js)                  │
│  Port 3000                                        │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │           Middleware Layer                    │  │
│  │  CORS ─► express.json() ─► verifyToken      │  │
│  │                             ─► requireRole   │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  ┌──────────────── Services ──────────────────┐   │
│  │  /api/auth      │  /api/crops              │   │
│  │  /api/orders    │  /api/users              │   │
│  │  /api/cart      │  /api/analytics          │   │
│  │  /api/reports   │  /api/stats              │   │
│  │  /api/settings  │                          │   │
│  └────────────────────────────────────────────┘   │
│                       │                           │
│  ┌────────────────────┴───────────────────────┐   │
│  │  Supabase Client (PostgREST + Auth)        │   │
│  │  - Anonymous client (public reads)          │   │
│  │  - Auth client (RLS-protected writes)       │   │
│  └────────────────────┬───────────────────────┘   │
└───────────────────────┼───────────────────────────┘
                        │ HTTPS
                        ▼
┌───────────────────────────────────────────────────┐
│              SUPABASE (Cloud)                      │
│                                                   │
│  ┌──────────────┐  ┌──────────────────────────┐   │
│  │  GoTrue Auth │  │  PostgreSQL Database      │   │
│  │  (JWT issue) │  │  with RLS Policies        │   │
│  └──────────────┘  │                           │   │
│                    │  Tables:                   │   │
│                    │   - profiles               │   │
│                    │   - products               │   │
│                    │   - crop_variety           │   │
│                    │   - orders                 │   │
│                    │   - fraud_reports          │   │
│                    └───────────────────────────┘   │
└───────────────────────────────────────────────────┘
```

### 4.2 Authentication Flow

```
REGISTRATION:
  User ─► Frontend form ─► POST /api/auth/register
    ─► Backend calls Supabase auth.signUp()
    ─► Supabase creates auth.users record + returns JWT
    ─► Backend inserts profile row in profiles table
    ─► Returns { token, refreshToken, user } to frontend
    ─► Frontend stores token in localStorage
    ─► Frontend calls supabase.auth.setSession() for sync

LOGIN:
  User ─► Frontend form ─► POST /api/auth/login
    ─► Backend calls Supabase auth.signInWithPassword()
    ─► Backend fetches profile from profiles table
    ─► Backend checks profile.blocked (rejects if true with 403)
    ─► Returns { token, refreshToken, user } to frontend
    ─► Frontend stores token, sets AuthContext state
    ─► Role-based redirect to dashboard

AUTHENTICATED REQUESTS:
  Frontend ─► Axios interceptor attaches Bearer token
    ─► Backend verifyToken middleware:
       1. Extracts token from Authorization header
       2. Validates via supabase.auth.getUser(token)
       3. Fetches role from profiles table
       4. Sets req.user = { id, email, role }
       5. Sets req.supabase = authClient (for RLS queries)
    ─► requireRole() checks req.user.role against allowed roles
    ─► Route handler executes with authenticated context

TOKEN REFRESH:
  Supabase client auto-detects expired token
    ─► Calls refresh_token endpoint
    ─► Triggers onAuthStateChange('TOKEN_REFRESHED')
    ─► Frontend updates localStorage with new token

LOGOUT:
  Frontend ─► Clears localStorage
    ─► Calls supabase.auth.signOut()
    ─► Clears AuthContext user state
    ─► Redirects to home
```

### 4.3 Request-Response Flow (Example: Place Order)

```
1. Buyer clicks "Place Order" in Cart.jsx
2. Frontend calls ordersAPI.placeOrder(items)
       ─► POST /api/orders with { items: [{ farmerId, cropId, quantity }] }
       ─► Authorization: Bearer <jwt_token>

3. Backend middleware:
       verifyToken() ─► validates JWT, sets req.user
       requireRole('buyer', 'both') ─► checks role

4. Route handler (orders/routes.js):
       For each item:
         a. Fetch product from DB ─► verify stock >= quantity
         b. Compute price = price_per_unit * quantity
         c. INSERT into orders table (status: 'requested')
         d. SELECT with joins to get farmer name, crop name
         e. formatOrder() maps DB row to frontend shape

5. Response: 201 Created with array of formatted orders

6. Frontend updates state, shows success message
```

---

## 5. User Roles & Permissions

### Role Matrix

| Feature | Farmer | Buyer | Both | Admin |
|---|:---:|:---:|:---:|:---:|
| Browse marketplace | Yes | Yes | Yes | Yes |
| Add crop listings | Yes | - | Yes | - |
| Manage own crops | Yes | - | Yes | - |
| Add to cart | - | Yes | Yes | - |
| Place orders | - | Yes | Yes | - |
| View received orders | Yes | - | Yes | - |
| Accept/reject orders | Yes | - | Yes | - |
| View purchase orders | - | Yes | Yes | - |
| View earnings | Yes | - | Yes | - |
| View farmer analytics | Yes | - | Yes | - |
| Report other users | Yes | Yes | Yes | - |
| Manage all users | - | - | - | Yes |
| Verify/block users | - | - | - | Yes |
| Manage all crops | - | - | - | Yes |
| Toggle featured crops | - | - | - | Yes |
| View all orders | - | - | - | Yes |
| Manage fraud reports | - | - | - | Yes |
| Platform settings | - | - | - | Yes |

### Blocking Cascade
When an admin blocks a farmer:
1. `profiles.blocked` set to `true`
2. All farmer's products set to `status = 'unavailable'`
3. All farmer's pending/ongoing orders set to `status = 'rejected'`
4. Farmer cannot log in (login returns 403)
5. Farmer's products hidden from marketplace (filtered on backend)

---

## 6. Complete Workflow

### 6.1 Farmer Workflow
```
Register as Farmer
    ─► Dashboard (stats: earnings, active orders, listed crops, rating)
    ─► Add Crop:
        Select variety (from crop_variety master table)
        ─► Enter quantity, unit (kg), price, description, harvest date
        ─► POST /api/crops ─► Product listed on marketplace
    ─► My Listings:
        View all own crops ─► Toggle availability ─► Edit price/quantity ─► Delete
    ─► Orders Received:
        View incoming orders (status: Requested)
        ─► Review (sets status: Ongoing)
        ─► Accept (sets status: Accepted, deducts product stock)
        ─► Reject (sets status: Rejected)
        ─► Report buyer (fraud/quality/payment/delivery report)
    ─► Earnings:
        Total earnings (sum of accepted orders)
        ─► Transaction list (credit per order - 2% platform fee)
        ─► Monthly revenue chart
    ─► Analytics:
        Monthly revenue trend ─► Top performing crops ─► Conversion rate
    ─► Settings:
        Update profile (name, phone, address) ─► Change password
```

### 6.2 Buyer Workflow
```
Register as Buyer
    ─► Dashboard (order stats, recent orders)
    ─► Marketplace:
        Browse crops ─► Search by name/farmer/location
        ─► Filter by category, price range, availability
        ─► Sort by price, newest, rating
        ─► View crop detail page
    ─► Add to Cart:
        Select quantity ─► Add to cart (in-memory on backend)
        ─► Modify quantity ─► Remove items
    ─► Checkout:
        Review cart items ─► Place order
        ─► POST /api/orders (creates one order per item)
        ─► Each order starts with status: 'requested'
    ─► My Orders:
        View all purchase orders ─► Filter by status
        ─► Track order progress (Requested -> Ongoing -> Accepted/Rejected)
        ─► Report farmer (fraud/quality/payment/delivery report)
    ─► Settings:
        Update profile ─► Change password
```

### 6.3 Admin Workflow
```
Login as Admin
    ─► Dashboard:
        KPIs: total users, crops, orders, revenue
        ─► Pending approvals (unverified users)
        ─► Flagged reports (pending/investigating)
    ─► User Management:
        View all users ─► Filter by role ─► Search by name/email
        ─► Verify user (sets verified = true)
        ─► Block user (sets blocked = true, cascading effects)
        ─► Unblock user
    ─► Crop Management:
        View all crops ─► Approve/reject listings
    ─► Market Prices:
        View all crops ─► Toggle "featured" flag
        ─► Featured crops appear in "Live Market Prices" on landing page
        ─► Live preview of landing page hero card
    ─► Order Management:
        View all platform orders ─► Filter by status
    ─► Reports:
        View fraud reports ─► Filter by status
        ─► Update status: pending -> investigating -> resolved/dismissed
        ─► Add admin notes
    ─► Settings:
        Platform name, support contact
        ─► Fee configuration (platform fee %, min order, max trade)
        ─► Security toggles (KYC, GST, 2FA, email verification)
        ─► Maintenance mode toggle
```

### 6.4 Order Lifecycle
```
                  ┌─────────────┐
                  │  REQUESTED  │  (Buyer places order)
                  └──────┬──────┘
                         │
              ┌──────────┼──────────┐
              ▼                     ▼
       ┌──────────┐          ┌──────────┐
       │ ONGOING  │          │ REJECTED │  (Farmer declines)
       │ (Review) │          └──────────┘
       └────┬─────┘
            │
     ┌──────┼──────┐
     ▼             ▼
┌──────────┐ ┌──────────┐
│ ACCEPTED │ │ REJECTED │
│(Stock    │ └──────────┘
│ deducted)│
└──────────┘
```

### 6.5 Fraud Reporting Flow
```
User (Farmer/Buyer) reports another user
    ─► Select type: fraud | quality | payment | delivery
    ─► Select severity: low | medium | high | critical
    ─► Write description
    ─► POST /api/reports

Admin reviews report
    ─► Status: pending -> investigating -> resolved/dismissed
    ─► Add admin notes
    ─► May choose to block the reported user
```

---

## 7. API Endpoints

**Base URL:** `http://localhost:3000/api`

### Auth Service (`/api/auth`) -- 5 endpoints
| Method | Path | Auth | Description |
|---|---|:---:|---|
| POST | /auth/register | No | Register new user (creates auth + profile) |
| POST | /auth/login | No | Login (returns JWT + profile, blocks if user.blocked) |
| GET | /auth/me | Yes | Get current user's profile |
| PUT | /auth/profile | Yes | Update profile fields |
| PUT | /auth/password | Yes | Change password (verifies current first) |

### Crops Service (`/api/crops`) -- 11 endpoints
| Method | Path | Auth | Roles | Description |
|---|---|:---:|---|---|
| GET | /crops/featured | No | - | Featured crops for landing page hero |
| GET | /crops | No | - | All crops with filters (excludes blocked farmers) |
| GET | /crops/categories | No | - | Crop category list |
| GET | /crops/farmers | No | - | List of all farmers |
| GET | /crops/varieties | No | - | Grouped varieties by category |
| GET | /crops/all | Yes | Admin | All crops with featured flag |
| GET | /crops/:id | No | - | Single crop detail |
| POST | /crops | Yes | Farmer, Both | Add new crop listing |
| PUT | /crops/:id | Yes | Owner/Admin | Update crop |
| PUT | /crops/:id/featured | Yes | Admin | Toggle featured flag |
| DELETE | /crops/:id | Yes | Owner/Admin | Delete crop |

### Orders Service (`/api/orders`) -- 5 endpoints
| Method | Path | Auth | Roles | Description |
|---|---|:---:|---|---|
| GET | /orders/farmer | Yes | Farmer, Both | Farmer's received orders |
| GET | /orders/buyer | Yes | Buyer, Both | Buyer's purchase orders |
| GET | /orders/all | Yes | Admin | All platform orders |
| POST | /orders | Yes | Buyer, Both | Place order (validates stock, computes price) |
| PUT | /orders/:id/status | Yes | Owner Farmer/Admin | Update status (deducts stock on accept) |

### Users Service (`/api/users`) -- 3 endpoints
| Method | Path | Auth | Roles | Description |
|---|---|:---:|---|---|
| GET | /users | Yes | Admin | List all users (filter by role, search) |
| GET | /users/:id | Yes | Admin | Get user details |
| PUT | /users/:id/status | Yes | Admin | Verify/block user (cascading effects) |

### Cart Service (`/api/cart`) -- 5 endpoints
| Method | Path | Auth | Roles | Description |
|---|---|:---:|---|---|
| GET | /cart | Yes | Buyer, Both | Get cart items (enriched with crop data) |
| POST | /cart | Yes | Buyer, Both | Add item to cart |
| PUT | /cart/:id | Yes | Buyer, Both | Update item quantity |
| DELETE | /cart/:id | Yes | Buyer, Both | Remove item |
| DELETE | /cart | Yes | Buyer, Both | Clear cart |

### Analytics Service (`/api/analytics`) -- 3 endpoints
| Method | Path | Auth | Roles | Description |
|---|---|:---:|---|---|
| GET | /analytics/farmer | Yes | Farmer, Both | Farmer analytics (revenue, top crops, conversion) |
| GET | /analytics/earnings | Yes | Farmer, Both | Earnings with transaction breakdown |
| GET | /analytics/admin | Yes | Admin | Platform-wide analytics |

### Reports Service (`/api/reports`) -- 3 endpoints
| Method | Path | Auth | Roles | Description |
|---|---|:---:|---|---|
| GET | /reports | Yes | Any | Fraud reports (admin=all, user=own) |
| POST | /reports | Yes | Any | Submit fraud report |
| PUT | /reports/:id/status | Yes | Admin | Update report status + admin notes |

### Stats Service (`/api/stats`) -- 3 endpoints
| Method | Path | Auth | Description |
|---|---|:---:|---|
| GET | /stats/platform | No | Platform stats (farmer count, crop count, etc.) |
| GET | /stats/team | No | Team members (hardcoded) |
| GET | /stats/admin | Yes (Admin) | Admin dashboard KPIs |

### Settings Service (`/api/settings`) -- 2 endpoints
| Method | Path | Auth | Roles | Description |
|---|---|:---:|---|---|
| GET | /settings | Yes | Admin | Get platform settings |
| PUT | /settings | Yes | Admin | Update platform settings |

**Total: 40 endpoints across 9 microservices**

---

## 8. Frontend Pages & Routing

### Public Pages (no auth)
| Path | Component | Description |
|---|---|---|
| / | Home | Landing page with hero, live market prices, featured crops, stats, testimonials |
| /marketplace | Marketplace | Browse/search/filter all crop listings |
| /marketplace/:id | CropDetail | Individual crop detail with add-to-cart |
| /how-it-works | HowItWorks | Platform guide |
| /about | About | Mission, values, team |
| /contact | Contact | Contact form |

### Auth Pages (guest only)
| Path | Component | Description |
|---|---|---|
| /login | Login | Email/password login |
| /register | Register | Multi-step registration |

### Farmer Pages (role: farmer)
| Path | Component | Description |
|---|---|---|
| /farmer/dashboard | FarmerDashboard | Stats, revenue chart, recent orders, quick actions |
| /farmer/crops | MyListings | Manage own crop listings |
| /farmer/add-crop | AddCrop | Add new crop form |
| /farmer/orders | FarmerOrders | View/manage received orders with status actions |
| /farmer/earnings | Earnings | Earnings overview with transaction history |
| /farmer/analytics | FarmerAnalytics | Revenue charts, top crops |
| /farmer/settings | FarmerSettings | Profile and password settings |

### Buyer Pages (role: buyer)
| Path | Component | Description |
|---|---|---|
| /buyer/dashboard | BuyerDashboard | Order stats, recent orders |
| /buyer/cart | Cart | Shopping cart with checkout |
| /buyer/orders | BuyerOrders | Order history with progress tracker |
| /buyer/settings | BuyerSettings | Profile settings |

### Admin Pages (role: admin)
| Path | Component | Description |
|---|---|---|
| /admin/dashboard | AdminDashboard | Platform KPIs and overview |
| /admin/users | UsersManagement | User management (verify/block) |
| /admin/crops | AdminCrops | Crop approval management |
| /admin/market-prices | AdminMarketPrices | Toggle featured crops for landing page |
| /admin/orders | AdminOrders | All platform orders |
| /admin/reports | Reports | Fraud report management |
| /admin/settings | AdminSettings | Platform settings |

### Route Protection
- **ProtectedRoute:** Redirects unauthenticated users to /login; wrong-role users to their dashboard
- **GuestRoute:** Redirects authenticated users away from /login and /register

---

## 9. Project File Structure

```
AgriChain/
├── PROJECT_SUMMARY.md
│
├── backend/
│   ├── server.js                         # Main Express server, mounts 9 services
│   ├── package.json
│   ├── .env                              # SUPABASE_URL, SUPABASE_ANON_KEY, PORT, FRONTEND_URL
│   ├── config/
│   │   └── supabase.js                   # Supabase clients (anonymous, auth, fresh)
│   ├── middleware/
│   │   └── auth.js                       # verifyToken, requireRole middleware
│   └── services/
│       ├── auth/routes.js                # Register, login, profile, password
│       ├── crops/routes.js               # CRUD crops, categories, varieties, featured
│       ├── orders/routes.js              # Place/manage orders, status updates
│       ├── users/routes.js               # Admin user management
│       ├── cart/routes.js                # Shopping cart (in-memory)
│       ├── analytics/routes.js           # Farmer/admin analytics computed from DB
│       ├── reports/routes.js             # Fraud reports
│       ├── stats/routes.js               # Platform/admin statistics
│       └── settings/routes.js            # Platform settings (in-memory)
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── .env                              # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_URL
    └── src/
        ├── main.jsx                      # Entry point (BrowserRouter + AuthProvider)
        ├── App.jsx                       # Route definitions (25+ routes)
        ├── App.css                       # Global styles
        ├── theme.css                     # CSS variables and design tokens
        ├── supabase/
        │   └── supabaseClient.js         # Frontend Supabase client
        ├── utils/
        │   └── AuthContext.jsx           # Auth state (login, logout, register)
        ├── api/
        │   ├── client.js                 # Axios instance with token interceptor
        │   ├── auth.js, crops.js, orders.js, cart.js
        │   ├── users.js, analytics.js, reports.js
        │   ├── stats.js, settings.js
        │   └── (each maps to a backend service)
        ├── layouts/
        │   ├── PublicLayout.jsx          # Navbar + Footer
        │   └── DashboardLayout.jsx       # Navbar + Sidebar + Content
        ├── components/
        │   ├── Navbar/                   # Top navigation
        │   ├── Sidebar/                  # Role-based sidebar with dynamic badges
        │   ├── Footer/                   # Site footer
        │   ├── CropCard/                 # Reusable crop card
        │   └── StatsCard/                # Reusable stats card
        └── pages/
            ├── public/                   # Home, Marketplace, CropDetail, About, etc.
            ├── auth/                     # Login, Register
            ├── farmer/                   # Dashboard, AddCrop, Orders, Earnings, etc.
            ├── buyer/                    # Dashboard, Cart, Orders, Settings
            └── admin/                    # Dashboard, Users, Crops, MarketPrices, etc.
```

---

## 10. Environment Variables

### Backend (`backend/.env`)
```env
SUPABASE_URL=https://xxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_SUPABASE_URL=https://xxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_API_URL=http://localhost:3000/api
```

---

## 11. How to Run

### Prerequisites
- Node.js (v18+)
- npm
- Supabase project with the required tables and RLS policies

### Backend
```bash
cd backend
npm install
node server.js
# Server runs at http://localhost:3000
# Loads 9 microservices: auth, crops, orders, users, cart, analytics, reports, stats, settings
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Dev server runs at http://localhost:5173
```

### Build for Production
```bash
cd frontend
npm run build       # Output in frontend/dist/
npm run preview     # Preview production build
```

---

## 12. Key Design Decisions

1. **Supabase PostgREST with explicit FK hints**: When two FKs point to the same table (e.g., orders -> profiles via farmer_id AND customer_id), PostgREST requires `!constraint_name` syntax to disambiguate joins.

2. **Backend mediates all DB access**: Frontend never queries Supabase directly for data. All reads/writes go through Express endpoints, which apply business logic, role checks, and data formatting before returning to the client.

3. **Cart and Settings are in-memory**: These two services store data in Node.js memory (not DB). Cart data resets on server restart. This is acceptable for the current prototype stage.

4. **Role "Both"**: Users with role "Both" can act as both Farmer and Buyer. All `requireRole()` calls include `'both'` alongside the primary role to support this.

5. **Featured crops for landing page**: The admin controls which crops appear in the "Live Market Prices" hero section via a `featured` boolean on the products table. Only featured crops are shown; if none are featured, the section is hidden.

6. **Order status deducts stock**: When a farmer accepts an order (status -> 'accepted'), the ordered quantity is automatically deducted from the product's available stock. Insufficient stock prevents acceptance.

7. **Blocked user cascade**: Blocking a farmer doesn't just prevent login -- it also removes their products from the marketplace and cancels their pending orders, ensuring no stale data remains visible.
