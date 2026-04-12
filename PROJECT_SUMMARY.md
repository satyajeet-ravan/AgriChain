# AgriChain - Project Summary

> **Last updated:** 2026-04-12

## 1. Project Name & Description

**AgriChain** is a full-stack agricultural marketplace platform that connects Indian farmers directly with buyers, eliminating middlemen. The platform provides role-based dashboards for three user types — Farmers, Buyers, and Admins — with features including crop listing, ordering, real-time chat, analytics, spoilage reporting, and platform administration.

**Authors:** Rajgaurav Patil, Satyajeet Ravan, Shravan Patil, Parth Madrewar

---

## 2. Directory Structure

```
AgriChain/
├── PROJECT_SUMMARY.md              # This file
├── README.md                       # Project README
│
├── backend/                        # Express.js API server (Microservice architecture)
│   ├── package.json                # Backend dependencies & config
│   ├── server.js                   # Main Express server — mounts all 12 microservice routes, CORS, error handlers
│   ├── config/
│   │   └── db.js                   # Database config placeholder (for future DB integration)
│   ├── middleware/
│   │   └── auth.js                 # JWT auth middleware: generateToken(), verifyToken(), requireRole()
│   └── services/                   # Microservice modules — each has routes.js (endpoints) and data.js (in-memory store)
│       ├── auth/
│       │   ├── data.js             # Seed users (6 users: 3 farmers, 2 buyers, 1 admin) with bcryptjs hashed passwords
│       │   └── routes.js           # Login, register, get profile, update profile, change password
│       ├── crops/
│       │   ├── data.js             # 12 crop listings, 6 categories, 4 farmer profiles
│       │   └── routes.js           # CRUD crops with filtering, sorting, search, farmer/admin permissions
│       ├── orders/
│       │   ├── data.js             # 4 farmer orders, 3 buyer orders with ID generators
│       │   └── routes.js           # Farmer/buyer/admin order views, place order, update status
│       ├── cart/
│       │   ├── data.js             # Per-user cart storage (keyed by userId)
│       │   └── routes.js           # Get cart, add/update/remove items, clear cart
│       ├── wishlist/
│       │   ├── data.js             # Per-user wishlist storage (crop ID arrays)
│       │   └── routes.js           # Get wishlist, add/remove crops
│       ├── chat/
│       │   ├── data.js             # 3 contacts, 5 seed messages with conversation keys
│       │   └── routes.js           # Get contacts, get/send messages (conversation-based)
│       ├── analytics/
│       │   ├── data.js             # Monthly revenue, farmer/buyer stats, transaction history
│       │   └── routes.js           # Farmer/buyer/admin analytics, earnings with transactions
│       ├── spoilage/
│       │   ├── data.js             # 2 spoilage reports with ID generator
│       │   └── routes.js           # Get/create spoilage reports, admin status update
│       ├── reports/
│       │   ├── data.js             # 3 fraud reports with ID generator
│       │   └── routes.js           # Get all reports (fraud + spoilage), create report, update status
│       ├── stats/
│       │   ├── data.js             # Platform stats, testimonials, team members, admin stats, notifications
│       │   └── routes.js           # Public stats/testimonials/team, admin stats, notifications
│       ├── users/
│       │   └── routes.js           # Admin user management: list, get by ID, update status/verification
│       └── settings/
│           └── routes.js           # Admin platform settings: get/update (in-memory storage)
│
└── frontend/                       # React + Vite SPA
    ├── package.json                # Frontend dependencies & scripts
    ├── index.html                  # Vite HTML entry point
    ├── vite.config.js              # Vite config with React plugin
    ├── eslint.config.js            # ESLint config
    └── src/
        ├── main.jsx                # App entry — BrowserRouter + AuthProvider wrapper
        ├── App.jsx                 # Route definitions — 30 routes with ProtectedRoute/GuestRoute guards
        ├── App.css                 # Global app styles
        ├── theme.css               # CSS variables, design tokens, global theme
        │
        ├── api/                    # Axios API layer — each file maps to a backend microservice
        │   ├── client.js           # Axios instance with baseURL, token interceptor, 401 handler
        │   ├── auth.js             # login, register, getProfile, updateProfile, changePassword
        │   ├── crops.js            # getAll, getById, getCategories, getFarmers, create, update, remove
        │   ├── orders.js           # getFarmerOrders, getBuyerOrders, getAllOrders, placeOrder, updateStatus
        │   ├── cart.js             # get, addItem, updateItem, removeItem, clear
        │   ├── wishlist.js         # get, add, remove
        │   ├── chat.js             # getContacts, getMessages, sendMessage
        │   ├── analytics.js        # getFarmerAnalytics, getBuyerAnalytics, getEarnings, getAdminAnalytics
        │   ├── spoilage.js         # getAll, create, updateStatus
        │   ├── reports.js          # getAll, create, updateStatus
        │   ├── stats.js            # getPlatformStats, getTestimonials, getTeam, getAdminStats, getNotifications
        │   ├── users.js            # getAll, getById, updateStatus
        │   └── settings.js         # get, update
        │
        ├── utils/
        │   ├── AuthContext.jsx     # React Context for auth state — login, logout, register, updateUser
        │   └── mockData.js         # Legacy mock data file (no longer imported by active pages)
        │
        ├── layouts/
        │   ├── PublicLayout.jsx    # Layout for public pages (Navbar + Footer)
        │   ├── DashboardLayout.jsx # Layout for authenticated pages (Sidebar + content area)
        │   └── DashboardLayout.css # Dashboard layout styles
        │
        ├── components/
        │   ├── Navbar/
        │   │   ├── Navbar.jsx      # Top navigation bar for public pages
        │   │   └── Navbar.css
        │   ├── Footer/
        │   │   ├── Footer.jsx      # Footer for public pages
        │   │   └── Footer.css
        │   ├── Sidebar/
        │   │   ├── Sidebar.jsx     # Dashboard sidebar with role-based navigation
        │   │   └── Sidebar.css
        │   ├── CropCard/
        │   │   ├── CropCard.jsx    # Reusable crop display card
        │   │   └── CropCard.css
        │   ├── StatsCard/
        │   │   ├── StatsCard.jsx   # Reusable statistics display card
        │   │   └── StatsCard.css
        │   ├── Chat/
        │   │   ├── Chat.jsx        # Full chat component — contacts list + message window
        │   │   └── Chat.css
        │   ├── categories.jsx      # Category filter component
        │   ├── categories.css
        │   ├── navigation.jsx      # Legacy navigation component
        │   ├── navigation.css
        │   ├── search-bar.jsx      # Search bar component
        │   └── searchbar.css
        │
        └── pages/
            ├── public/                     # Public-facing pages (no auth required)
            │   ├── Home.jsx / Home.css     # Landing page — hero, stats, featured crops, testimonials
            │   ├── Marketplace.jsx / .css  # Browse/filter/search all crop listings
            │   ├── About.jsx / About.css   # About page — mission, values, impact, team
            │   ├── HowItWorks.jsx / .css   # How the platform works (static)
            │   └── Contact.jsx / .css      # Contact form page (static)
            │
            ├── auth/                       # Authentication pages
            │   ├── Login.jsx               # Login form with email/password
            │   ├── Register.jsx            # Multi-step registration form
            │   ├── ForgotPassword.jsx      # Password reset page (static/placeholder)
            │   └── Auth.css                # Shared auth page styles
            │
            ├── farmer/                     # Farmer dashboard pages (role: farmer)
            │   ├── FarmerDashboard.jsx/.css # Dashboard overview — stats, recent orders, revenue chart
            │   ├── AddCrop.jsx / .css      # Form to add new crop listing
            │   ├── MyListings.jsx          # Manage farmer's crop listings (toggle availability, delete)
            │   ├── FarmerOrders.jsx        # View/manage received orders, update status
            │   ├── Spoilage.jsx            # Report crop spoilage/loss
            │   ├── Earnings.jsx            # Earnings overview with transaction history
            │   ├── FarmerAnalytics.jsx     # Revenue charts, top crops, engagement metrics
            │   ├── FarmerChat.jsx          # Chat interface (wraps Chat component)
            │   └── FarmerSettings.jsx      # Profile settings and password change
            │
            ├── buyer/                      # Buyer dashboard pages (role: buyer)
            │   ├── BuyerDashboard.jsx      # Dashboard — order stats, recent orders, recommendations
            │   ├── Cart.jsx                # Shopping cart with checkout flow
            │   ├── BuyerOrders.jsx         # Order history with status tracking
            │   ├── Wishlist.jsx            # Saved/wishlisted crops
            │   ├── BuyerAnalytics.jsx      # Purchase analytics and spending trends
            │   ├── BuyerChat.jsx           # Chat interface (wraps Chat component)
            │   └── BuyerSettings.jsx       # Profile settings
            │
            ├── admin/                      # Admin dashboard pages (role: admin)
            │   ├── AdminDashboard.jsx      # Platform overview — user/order/revenue stats
            │   ├── UsersManagement.jsx     # Manage all users — verify, block, search, filter by role
            │   ├── AdminCrops.jsx          # Review and approve/reject crop listings
            │   ├── AdminOrders.jsx         # Monitor all platform orders
            │   ├── Reports.jsx             # Fraud reports and spoilage claims management
            │   └── AdminSettings.jsx       # Platform settings — general, fees, security, maintenance
            │
            └── (legacy pages)              # Older pages from initial build (not actively routed)
                ├── home.jsx / home.css
                ├── login.jsx / login.css
                ├── sign-up.jsx / sign-up.css
                ├── forget-password.jsx / .css
                ├── cart.jsx
                ├── orders.jsx
                ├── porducts.jsx
                └── product-detail.jsx
```

---

## 3. Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.0 | UI library |
| React Router DOM | 7.13.1 | Client-side routing |
| Vite | 7.3.1 | Build tool & dev server |
| Axios | 1.15.0 | HTTP client for API calls |
| React Icons | 5.6.0 | Icon library |
| FontAwesome (React) | 3.2.0 | Additional icons |
| Headless UI | 2.2.10 | Accessible UI primitives |
| react-phone-number-input | 3.4.16 | Phone number input with country codes |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | (user's installed version) | Runtime |
| Express | 4.x | HTTP server framework |
| bcryptjs | 3.0.3 | Password hashing (pure JS) |
| jsonwebtoken | 9.0.3 | JWT token generation/verification |
| cors | 2.8.6 | Cross-origin resource sharing |
| dotenv | 17.4.1 | Environment variable loading |

### Database
| Technology | Status |
|---|---|
| In-memory JavaScript objects | **Currently active** — all data stored in `data.js` files per service |
| PostgreSQL / MongoDB | **Placeholder** — `config/db.js` exists with config but no connection logic |

### Architecture
- **Pattern:** Microservice-style modular backend (12 service modules)
- **Auth:** JWT Bearer tokens with role-based access control (farmer, buyer, admin)
- **State:** React Context (AuthContext) for client-side auth state
- **Storage:** localStorage for JWT token and user profile persistence
- **Module System:** ES Modules (`"type": "module"`) in both frontend and backend

---

## 4. Features

### Built (Fully Functional)

#### Public Features
- [x] Landing page with platform stats, featured crops, testimonials
- [x] Marketplace — browse, search, filter, sort crops
- [x] About page — mission, vision, values, team (dynamic from API)
- [x] How It Works page
- [x] Contact page
- [x] 404 page

#### Authentication
- [x] Login with email/password (demo mode: accepts any password)
- [x] Registration with multi-step form
- [x] JWT token-based auth with 7-day expiry
- [x] Auto-redirect based on role after login
- [x] Protected routes with role guards
- [x] Guest routes (redirect authenticated users away from login/register)
- [x] 401 interceptor — auto-logout on expired tokens

#### Farmer Features
- [x] Dashboard with stats overview (earnings, orders, crops, rating)
- [x] Add new crop listing
- [x] Manage listings — toggle availability, delete
- [x] View/manage orders — update status (Pending > Processing > Shipped > Delivered)
- [x] Report crop spoilage/loss
- [x] View earnings with transaction history
- [x] Analytics — monthly revenue, top crops, engagement
- [x] Chat with buyers
- [x] Profile settings and password change

#### Buyer Features
- [x] Dashboard with order stats and recommendations
- [x] Shopping cart — add, update quantity, remove, checkout
- [x] Order history with status tracking
- [x] Wishlist — save/remove crops
- [x] Purchase analytics
- [x] Chat with farmers
- [x] Profile settings

#### Admin Features
- [x] Dashboard — platform-wide stats (users, crops, orders, revenue)
- [x] User management — list, search, filter by role, verify/block users
- [x] Crop management — review and approve/reject listings
- [x] Order monitoring — view all platform orders, filter by status
- [x] Reports — fraud reports and spoilage claims, resolve reports
- [x] Platform settings — general, fees, security toggles, maintenance actions

### In Progress / Pending
- [ ] **Real database integration** — currently all data is in-memory and resets on server restart
- [ ] **Forgot password flow** — page exists but no backend logic (no email service)
- [ ] **File uploads** — crop images are hardcoded Unsplash URLs, no actual upload
- [ ] **Real-time chat** — currently HTTP polling, no WebSocket/SSE
- [ ] **Payment integration** — checkout flow exists but no actual payment gateway (Razorpay/PayU/PhonePe placeholders in settings)
- [ ] **Email notifications** — no email service integrated
- [ ] **Crop detail page** — individual crop view page not routed (legacy `product-detail.jsx` exists)
- [ ] **Search from Navbar** — search bar component exists but not wired to marketplace filters
- [ ] **Maintenance mode** — toggle exists in admin settings but no middleware to enforce it

---

## 5. API Endpoints

**Base URL:** `http://localhost:3000/api`

### Auth Service (`/api/auth`)
| Method | Endpoint | Auth | Description | Request Body | Response |
|---|---|---|---|---|---|
| POST | `/auth/login` | No | Login | `{ email, password, role? }` | `{ token, user }` |
| POST | `/auth/register` | No | Register new user | `{ name, email, password, role, phone?, location? }` | `{ token, user }` |
| GET | `/auth/me` | Bearer | Get current user profile | — | `{ id, name, email, role, avatar, location, phone, verified, joined, bio }` |
| PUT | `/auth/profile` | Bearer | Update profile | `{ name?, phone?, location?, bio?, avatar? }` | Updated user object |
| PUT | `/auth/password` | Bearer | Change password | `{ currentPassword, newPassword }` | `{ message }` |

### Crops Service (`/api/crops`)
| Method | Endpoint | Auth | Description | Request / Params | Response |
|---|---|---|---|---|---|
| GET | `/crops` | No | List crops (with filters) | Query: `search, category, organic, available, minPrice, maxPrice, sortBy, farmerId` | `[{ id, name, category, price, unit, quantity, farmer, location, image, rating, reviews, available, organic, description, approvalStatus, views, enquiries }]` |
| GET | `/crops/categories` | No | List categories | — | `[{ id, label, icon }]` |
| GET | `/crops/farmers` | No | List farmers | — | `[{ id, name, location, crops, rating, image, verified, yearsActive }]` |
| GET | `/crops/:id` | No | Get crop by ID | — | Crop object |
| POST | `/crops` | Farmer | Create crop listing | `{ name, category, variety?, quantity, unit?, price, minOrder?, description?, state?, city?, harvestDate?, organic?, available? }` | Created crop object |
| PUT | `/crops/:id` | Bearer | Update crop | `{ name?, category?, price?, unit?, quantity?, description?, organic?, available?, approvalStatus? (admin) }` | Updated crop object |
| DELETE | `/crops/:id` | Bearer | Delete crop | — | `{ message }` |

### Orders Service (`/api/orders`)
| Method | Endpoint | Auth | Description | Request Body | Response |
|---|---|---|---|---|---|
| GET | `/orders/farmer` | Farmer | Get farmer's orders | Query: `status?` | `[{ id, farmerId, buyerId, buyer, crop, quantity, amount, status, date }]` |
| GET | `/orders/buyer` | Buyer | Get buyer's orders | Query: `status?` | `[{ id, buyerId, farmerId, farmer, crop, quantity, amount, status, date, tracking }]` |
| GET | `/orders/all` | Admin | Get all platform orders | Query: `status?` | `[{ ...order, type }]` |
| POST | `/orders` | Buyer | Place order | `{ items: [{ farmerId?, farmer?, cropName, quantity, amount }], paymentMethod? }` | `[created orders]` |
| PUT | `/orders/:id/status` | Bearer | Update order status | `{ status }` | Updated order object |

### Cart Service (`/api/cart`)
| Method | Endpoint | Auth | Description | Request Body | Response |
|---|---|---|---|---|---|
| GET | `/cart` | Buyer | Get cart items | — | `[{ id, cropId, quantity, crop: {...} }]` |
| POST | `/cart` | Buyer | Add item to cart | `{ cropId, quantity? }` | Cart item with crop data |
| PUT | `/cart/:id` | Buyer | Update cart item quantity | `{ quantity }` | Updated cart item |
| DELETE | `/cart/:id` | Buyer | Remove item from cart | — | `{ message }` |
| DELETE | `/cart` | Buyer | Clear entire cart | — | `{ message }` |

### Wishlist Service (`/api/wishlist`)
| Method | Endpoint | Auth | Description | Request Body | Response |
|---|---|---|---|---|---|
| GET | `/wishlist` | Buyer | Get wishlist crops | — | `[crop objects]` |
| POST | `/wishlist` | Buyer | Add crop to wishlist | `{ cropId }` | `{ message }` |
| DELETE | `/wishlist/:cropId` | Buyer | Remove from wishlist | — | `{ message }` |

### Chat Service (`/api/chat`)
| Method | Endpoint | Auth | Description | Request Body | Response |
|---|---|---|---|---|---|
| GET | `/chat/contacts` | Bearer | Get chat contacts | — | `[{ id, userId, name, role, avatar, online, lastMsg, time, unread }]` |
| GET | `/chat/messages/:contactUserId` | Bearer | Get messages with contact | — | `[{ id, from, text, time }]` |
| POST | `/chat/messages/:contactUserId` | Bearer | Send message | `{ text }` | `{ id, from, text, time }` |

### Analytics Service (`/api/analytics`)
| Method | Endpoint | Auth | Description | Response |
|---|---|---|---|---|
| GET | `/analytics/farmer` | Bearer | Farmer analytics | `{ stats, monthlyRevenue, months, topCrops, weeklyEngagement }` |
| GET | `/analytics/buyer` | Bearer | Buyer analytics | `{ stats, monthlyRevenue, months }` |
| GET | `/analytics/earnings` | Bearer | Earnings + transactions | `{ transactions, totalEarnings, totalFees, netEarnings, monthlyRevenue, months }` |
| GET | `/analytics/admin` | Bearer | Admin analytics | `{ monthlyRevenue, months, topCrops }` |

### Spoilage Service (`/api/spoilage`)
| Method | Endpoint | Auth | Description | Request Body | Response |
|---|---|---|---|---|---|
| GET | `/spoilage` | Bearer | Get spoilage reports (farmer sees own, admin sees all) | — | `[{ id, farmerId, crop, quantity, reason, date, status, value, description }]` |
| POST | `/spoilage` | Farmer | Report spoilage | `{ crop, quantity, reason, date, description? }` | Created report |
| PUT | `/spoilage/:id/status` | Admin | Update report status | `{ status }` | Updated report |

### Reports Service (`/api/reports`)
| Method | Endpoint | Auth | Description | Request Body | Response |
|---|---|---|---|---|---|
| GET | `/reports` | Admin | Get all fraud + spoilage reports | — | `{ fraudReports, spoilageReports }` |
| POST | `/reports` | Bearer | Submit fraud report | `{ type, reported, description, severity? }` | Created report |
| PUT | `/reports/:id/status` | Admin | Update report status | `{ status }` | Updated report |

### Stats Service (`/api/stats`)
| Method | Endpoint | Auth | Description | Response |
|---|---|---|---|---|
| GET | `/stats/platform` | No | Public platform stats | `[{ label, value, icon }]` |
| GET | `/stats/testimonials` | No | Public testimonials | `[{ id, name, role, text, avatar, rating }]` |
| GET | `/stats/team` | No | Public team members | `[{ name, role, bio, avatar }]` |
| GET | `/stats/admin` | Bearer | Admin dashboard stats | `{ totalUsers, totalCrops, totalOrders, totalRevenue, pendingApprovals, flaggedReports, activeDisputes }` |
| GET | `/stats/notifications` | Bearer | User notifications | `[{ id, type, message, time, read }]` |

### Users Service (`/api/users`)
| Method | Endpoint | Auth | Description | Request Body | Response |
|---|---|---|---|---|---|
| GET | `/users` | Admin | List users | Query: `role?, search?` | `[user objects (no password)]` |
| GET | `/users/:id` | Admin | Get user by ID | — | User object (no password) |
| PUT | `/users/:id/status` | Admin | Update user status | `{ verified?, status? }` | Updated user |

### Settings Service (`/api/settings`)
| Method | Endpoint | Auth | Description | Request Body | Response |
|---|---|---|---|---|---|
| GET | `/settings` | Admin | Get platform settings | — | Settings object |
| PUT | `/settings` | Admin | Update platform settings | Partial settings object | Updated settings |

**Total: 48 endpoints across 12 microservices**

---

## 6. Environment Variables

### Backend (`backend/.env`)
```env
PORT=3000                                    # Server port (default: 3000)
FRONTEND_URL=http://localhost:5173           # CORS allowed origin (default: http://localhost:5173)
JWT_SECRET=your-secret-key-here              # JWT signing secret (default: agrichain-secret-key-2025)
DB_HOST=localhost                            # Database host (placeholder, not yet used)
DB_PORT=5432                                 # Database port (placeholder, not yet used)
DB_NAME=agrichain                            # Database name (placeholder, not yet used)
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3000/api       # Backend API base URL (default: http://localhost:3000/api)
```

> **Note:** No `.env` files currently exist in the project. The app works with built-in defaults.

---

## 7. How to Run

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Backend
```bash
cd backend
npm install
node server.js
# Server runs at http://localhost:3000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Dev server runs at http://localhost:5173
```

### Demo Accounts
| Role | Email | Password |
|---|---|---|
| Farmer | farmer@agrichain.com | password123 |
| Buyer | buyer@agrichain.com | password123 |
| Admin | admin@agrichain.com | password123 |

> **Demo mode:** The login endpoint currently accepts any password for existing accounts.

### Build for Production
```bash
cd frontend
npm run build     # Output in frontend/dist/
npm run preview   # Preview production build locally
```

---

## 8. Known Issues & Bugs

1. **Data is not persistent** — All backend data is stored in-memory (JavaScript objects). Data resets every time the server restarts. No database is connected yet.

2. **Demo mode login bypass** — The login endpoint accepts any password (bcrypt compare failure is silently ignored). This is intentional for development but must be fixed before production.

3. **Legacy pages not cleaned up** — Old pages (`frontend/src/pages/home.jsx`, `login.jsx`, `sign-up.jsx`, `cart.jsx`, `orders.jsx`, `porducts.jsx`, `product-detail.jsx`, `forget-password.jsx`) are still in the codebase but not routed in `App.jsx`. They reference old imports and patterns.

4. **Legacy `mockData.js` still exists** — `frontend/src/utils/mockData.js` is no longer imported by active pages but the file remains.

5. **`bcrypt` (native) still in dependencies** — `package.json` still lists `bcrypt` alongside `bcryptjs`. The native `bcrypt` is unused but still installed. Can be removed with `npm uninstall bcrypt`.

6. **No input sanitization** — Backend does not sanitize or validate input beyond basic required-field checks. No protection against XSS in stored data.

7. **Crop images are static URLs** — All crop images point to Unsplash URLs. No file upload system exists.

8. **Chat is not real-time** — Messages are fetched via HTTP GET. No WebSocket or polling mechanism for live updates.

9. **Forgot Password is non-functional** — The page renders a form but has no backend logic or email service.

10. **No pagination** — All list endpoints return full datasets. Will become a problem at scale.

---

## 9. Current State of the Project

**Stage:** Development / Prototype

The application is a **fully functional prototype** with a complete frontend-to-backend integration:

- **Frontend:** 30 routes across public, farmer, buyer, and admin sections. All pages fetch data dynamically from the API. Role-based routing with JWT authentication. Responsive CSS with a consistent design system.

- **Backend:** 12 microservice modules exposing 48 RESTful API endpoints. JWT authentication with role-based middleware. All data is seeded in-memory from `data.js` files (migrated from former frontend mock data).

- **Integration:** Axios HTTP client with automatic token injection and 401 handling. Every frontend page makes real API calls — zero static/mock data imports in active code.

**What works end-to-end:**
- User registration and login (all 3 roles)
- Browsing/searching/filtering the marketplace
- Farmer adding crops, managing listings, viewing orders
- Buyer adding to cart, checking out, viewing order history
- Admin viewing platform stats, managing users/crops/orders
- Chat between users (non-real-time)
- Spoilage and fraud reporting
- Platform settings management

**Next steps to production-readiness:**
1. Connect a real database (PostgreSQL or MongoDB)
2. Remove demo login bypass — enforce real password validation
3. Add file upload for crop images
4. Implement WebSocket for real-time chat
5. Integrate payment gateway (Razorpay)
6. Add email service for notifications and password reset
7. Add input validation/sanitization
8. Add pagination to list endpoints
9. Clean up legacy files
10. Deploy (e.g., Railway/Render for backend, Vercel/Netlify for frontend)
