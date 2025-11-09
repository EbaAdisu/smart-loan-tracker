# 🚀 Backend Action Plan - Elysia.js + MongoDB + Better Auth

> ✅ **STATUS: COMPLETED - November 9, 2025**  
> All features implemented, tested, and running successfully!  
> See `COMPLETION_REPORT.md` for full details.

## 📋 Overview
Backend API for Decentralized Loan Tracker using **Elysia.js**, **MongoDB**, and **Better Auth** for authentication. Handles off-chain features: user profiles, notifications, analytics, messaging.

## 📊 Progress Tracking

### Overall Progress
- **Implementation Steps:** 9/9 completed ✅
- **Database Models:** 5/5 custom models completed (Better Auth models are auto-created) ✅
- **API Routes:** 24/24 endpoints completed ✅
- **Core Services:** 5/5 services completed ✅
- **Cron Jobs:** 3/3 jobs configured ✅
- **WebSocket Events:** 4/4 features implemented ✅

### Quick Status
- [x] Project Setup ✅
- [x] Database Setup ✅
- [x] Better Auth Setup ✅
- [x] User Routes ✅
- [x] Loan Routes ✅
- [x] Analytics Routes ✅
- [x] Message Routes ✅
- [x] Notification Routes ✅
- [x] Testing & Documentation ✅

---

## 🛠️ Tech Stack

### Core
- **Framework:** Elysia.js (Bun runtime)
- **Database:** MongoDB Atlas (free tier)
- **ORM:** Mongoose
- **Auth:** Better Auth (Expo-compatible)
- **Validation:** Elysia tRPC or Zod

### Additional
- **Cron Jobs:** node-cron (notifications, analytics)
- **WebSockets:** Elysia WebSocket plugin (real-time messaging)
- **File Storage:** MongoDB GridFS or Cloudinary (profile pics)

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.ts                 # Elysia app entry
│   ├── config/
│   │   ├── database.ts          # MongoDB connection
│   │   ├── auth.ts              # Better Auth config
│   │   └── env.ts               # Environment variables
│   ├── models/
│   │   ├── User.ts              # User schema (name, email, wallet)
│   │   ├── Loan.ts              # Loan metadata (sync with blockchain)
│   │   ├── Payment.ts           # Payment history
│   │   ├── Message.ts            # Chat messages
│   │   └── Notification.ts      # Push notifications
│   ├── routes/
│   │   ├── auth.ts              # Better Auth routes
│   │   ├── users.ts             # User CRUD
│   │   ├── loans.ts             # Loan metadata
│   │   ├── analytics.ts         # Analytics endpoints
│   │   ├── messages.ts          # Chat endpoints
│   │   └── notifications.ts     # Notification endpoints
│   ├── services/
│   │   ├── auth.service.ts      # Auth logic
│   │   ├── loan.service.ts      # Loan sync logic
│   │   ├── analytics.service.ts # Analytics calculations
│   │   ├── notification.service.ts # Push notifications
│   │   └── message.service.ts   # Chat logic
│   ├── middleware/
│   │   ├── auth.middleware.ts   # Auth verification
│   │   └── validation.middleware.ts # Request validation
│   └── utils/
│       ├── logger.ts            # Logging
│       └── errors.ts            # Error handling
├── package.json
├── tsconfig.json
└── .env.example
```

---

## 🗄️ Database Models

### Better Auth Built-in Models (Auto-created by Better Auth)
Better Auth automatically creates these models in MongoDB:
- [x] **user** - User accounts (id, email, emailVerified, name, image, createdAt, updatedAt)
- [x] **session** - Active sessions (id, userId, expiresAt, token)
- [x] **account** - OAuth accounts (id, userId, accountId, provider, accessToken, refreshToken)
- [x] **verification** - Email verification tokens (id, identifier, token, expiresAt)

**Note:** Better Auth manages these models automatically. Don't create them manually.

### 1. User Profile Model (Extends Better Auth User)
- [x] Model created ✅
- [x] Schema defined ✅
- [x] Indexes added ✅
```typescript
// Extends Better Auth's user model
{
  _id: ObjectId,
  userId: string (references Better Auth user.id, unique, required, indexed),
  profilePicture?: string,
  deviceTokens: string[], // For push notifications
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

**Important:** Link to Better Auth user via `userId` field. No wallet addresses needed.

### 2. Loan Model
- [x] Model created ✅
- [x] Schema defined ✅
- [x] Indexes added ✅
```typescript
{
  _id: ObjectId,
  loanId: string (unique, auto-generated),
  lenderUserId: string (references UserProfile.userId, required, indexed),
  borrowerUserId: string (references UserProfile.userId, required, indexed),
  lenderName: string, // Resolved from Better Auth user
  borrowerName: string, // Resolved from Better Auth user
  amount: number (required),
  reason: string,
  dateCreated: Date,
  dueDate: Date,
  status: enum ['pending', 'active', 'completed', 'overdue', 'cancelled'],
  balanceRemaining: number,
  createdAt: Date,
  updatedAt: Date
}
```

**Note:** All loans stored in MongoDB. No blockchain integration in this branch.

### 3. Payment Model
- [x] Model created ✅
- [x] Schema defined ✅
- [x] Indexes added ✅
```typescript
{
  _id: ObjectId,
  loanId: string (references Loan.loanId, required, indexed),
  amount: number (required),
  timestamp: Date (required),
  createdAt: Date
}
```

### 4. Message Model
- [x] Model created ✅
- [x] Schema defined ✅
- [x] Indexes added ✅
```typescript
{
  _id: ObjectId,
  loanId: string (references Loan.loanId, required, indexed),
  senderUserId: string (references UserProfile.userId, required, indexed),
  receiverUserId: string (references UserProfile.userId, required, indexed),
  senderName: string, // Resolved from Better Auth user
  content: string (required),
  read: boolean (default: false),
  createdAt: Date
}
```

### 5. Notification Model
- [x] Model created ✅
- [x] Schema defined ✅
- [x] Indexes added ✅
```typescript
{
  _id: ObjectId,
  userId: string (references UserProfile.userId, required, indexed),
  type: enum ['loan_due', 'loan_overdue', 'payment_received', 'new_message', 'status_change'],
  title: string (required),
  body: string (required),
  loanId?: string (references Loan.loanId),
  read: boolean (default: false),
  createdAt: Date
}
```

---

## 🔐 Better Auth Configuration

### Setup Requirements
1. **Install:** 
   - [x] Install better-auth ✅
   - [x] Install @better-auth/elysia ✅
   - [x] Install @better-auth/mongodb ✅
   ```bash
   bun add better-auth @better-auth/elysia @better-auth/mongodb
   ```

2. **MongoDB Adapter Setup:**
   - [x] MongoDB adapter configured ✅
   - [x] Connection tested ✅
   ```typescript
   import { MongoDBAdapter } from "@better-auth/mongodb";
   import { MongoClient } from "mongodb";
   
   const client = new MongoClient(process.env.MONGODB_URI!);
   await client.connect();
   const db = client.db("loan-tracker");
   
   export const auth = betterAuth({
     database: MongoDBAdapter(client, {
       dbName: "loan-tracker",
     }),
     emailAndPassword: {
       enabled: true,
     },
   });
   ```

3. **Better Auth Models:**
   - [x] Better Auth collections verified (auto-created) ✅
     - [x] `user` - User accounts ✅
     - [x] `session` - Active sessions ✅
     - [x] `account` - OAuth accounts ✅
     - [x] `verification` - Email verification ✅
   - **DO NOT create these manually** - Better Auth manages them

4. **Custom User Profile:**
   - [x] `userProfile` collection created ✅
   - [x] Linked via `userId` (references Better Auth `user.id`) ✅
   - [x] Fields implemented: profilePicture, deviceTokens ✅

### Auth Features Needed
- [x] Email/Password signup/login (built-in) ✅
- [x] OAuth (Google/Gmail) - optional, built-in ✅
- [x] Session management (automatic) ✅
- [x] Password reset (built-in) ✅
- [x] Email verification (optional, built-in) ✅

### Expo Integration
- Better Auth provides REST API endpoints at `/api/auth/*`
- Expo app calls endpoints directly
- Session cookies or JWT tokens (configurable)
- No native modules required

---

## 🛣️ API Routes

### Auth Routes (`/api/auth/*`)
- [x] `POST /api/auth/signup` - Create account (email, password, name) - Better Auth handles ✅
- [x] `POST /api/auth/login` - Login (email, password) - Better Auth handles ✅
- [x] `POST /api/auth/logout` - Logout - Better Auth handles ✅
- [x] `GET /api/auth/session` - Get current session - Better Auth handles ✅
- [x] `POST /api/auth/reset-password` - Password reset - Better Auth handles ✅

### User Routes (`/api/users/*`)
- [x] `GET /api/users/me` - Get current user profile (with Better Auth user data) ✅
- [x] `PUT /api/users/me` - Update profile (name, picture) ✅
- [x] `GET /api/users/search?q=name` - Search users by name/email ✅
- [x] `GET /api/users/:userId` - Get user by ID ✅
- [x] `POST /api/users/device-token` - Register push notification token ✅

### Loan Routes (`/api/loans/*`)
- [x] `POST /api/loans` - Create new loan ✅
- [x] `GET /api/loans` - Get all loans for current user ✅
- [x] `GET /api/loans/:loanId` - Get loan details ✅
- [x] `PUT /api/loans/:loanId` - Update loan (status, amount, etc.) ✅
- [x] `DELETE /api/loans/:loanId` - Delete loan (soft delete) ✅

### Analytics Routes (`/api/analytics/*`)
- [x] `GET /api/analytics/summary` - Overall summary (total given/received, net) ✅
- [x] `GET /api/analytics/monthly?month=2024-01` - Monthly breakdown ✅
- [x] `GET /api/analytics/yearly?year=2024` - Yearly summary ✅
- [x] `GET /api/analytics/categories` - Breakdown by reason/category ✅

### Message Routes (`/api/messages/*`)
- [x] `GET /api/messages/loans/:loanId` - Get messages for a loan ✅
- [x] `POST /api/messages` - Send message ✅
- [x] `PUT /api/messages/:messageId/read` - Mark as read ✅
- [x] `GET /api/messages/unread-count` - Get unread count ✅

### Notification Routes (`/api/notifications/*`)
- [x] `GET /api/notifications` - Get user notifications ✅
- [x] `PUT /api/notifications/:id/read` - Mark as read ✅
- [x] `DELETE /api/notifications/:id` - Delete notification ✅

---

## 🔄 Core Services

### 1. Auth Service
- [x] Better Auth integration (email validation, password hashing, JWT tokens) ✅
- [x] Create userProfile after Better Auth signup ✅
- [x] Link userId to profile ✅

### 2. Loan Service
- [x] Create/update loans in MongoDB ✅
- [x] Resolve user IDs to names (from Better Auth user) ✅
- [x] Calculate loan statistics ✅
- [x] Update loan status (pending → active → completed) ✅

### 3. Analytics Service
- [x] Aggregate loan data (given/received) ✅
- [x] Calculate net position ✅
- [x] Group by time period (monthly/yearly) ✅
- [x] Category breakdown ✅

### 4. Notification Service
- [x] Check for due loans (daily cron) ✅
- [x] Check for overdue loans ✅
- [x] Send push notifications via Expo Push API ✅
- [x] Create notification records ✅

### 5. Message Service
- [x] Store chat messages ✅
- [x] Link messages to loans ✅
- [x] Real-time delivery via WebSocket ✅
- [x] Mark as read/unread ✅

---

## ⏰ Cron Jobs

### Daily Jobs (node-cron)
1. **Check Due Loans** (runs daily at 9 AM)
   - [x] Cron job configured ✅
   - [x] Find loans due in 3 days ✅
   - [x] Send notification to borrower ✅

2. **Check Overdue Loans** (runs daily at 9 AM)
   - [x] Cron job configured ✅
   - [x] Find loans past due date ✅
   - [x] Update status to "overdue" ✅
   - [x] Send notification to both parties ✅

3. **Aggregate Analytics** (runs daily at 2 AM)
   - [x] Cron job configured ✅
   - [x] Calculate monthly/yearly stats ✅
   - [x] Cache results for faster API responses ✅

---

## 🔌 WebSocket Events

### Real-time Features
- [x] New message received ✅
- [x] Loan status changed ✅
- [x] New notification ✅
- [x] User online/offline status ✅

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "elysia": "^1.1.0",
    "@elysiajs/cors": "^1.1.0",
    "@elysiajs/swagger": "^1.1.0",
    "better-auth": "latest",
    "@better-auth/elysia": "latest",
    "@better-auth/mongodb": "latest",
    "mongodb": "^6.0.0",
    "mongoose": "^8.0.0",
    "zod": "^3.22.0",
    "node-cron": "^3.0.0",
    "expo-server-sdk": "^3.7.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "bun-types": "latest"
  }
}
```

**Note:** Better Auth handles password hashing and JWT tokens internally - no need for bcrypt/jsonwebtoken

---

## 🚀 Implementation Steps

### Step 1: Project Setup (30 min) ✅
- [x] Initialize Bun project ✅
- [x] Install Elysia.js ✅
- [x] Setup TypeScript config ✅
- [x] Create folder structure ✅

### Step 2: Database Setup (1 hour) ✅
- [x] Create MongoDB Atlas account ✅
- [x] Setup connection ✅
- [x] Create Mongoose schemas for all models ✅
- [x] Test connection ✅

### Step 3: Better Auth Setup (2 hours) ✅
- [x] Install Better Auth packages (`better-auth`, `@better-auth/elysia`, `@better-auth/mongodb`) ✅
- [x] Configure MongoDB adapter (Better Auth auto-creates user/session/account tables) ✅
- [x] Setup email/password provider (built-in) ✅
- [x] Create `userProfile` model (extends Better Auth user) ✅
- [x] Test signup/login endpoints ✅
- [x] **Important:** Don't create user/session models manually - Better Auth handles them ✅

### Step 4: User Routes (2 hours) ✅
- [x] Create UserProfile model (links to Better Auth user via userId) ✅
- [x] Implement profile CRUD routes (Better Auth handles auth routes) ✅
- [x] Add search functionality (search by name/email) ✅
- [x] Test endpoints ✅

### Step 5: Loan Routes (3 hours) ✅
- [x] Create Loan model (uses userId, not wallet) ✅
- [x] Implement CRUD endpoints ✅
- [x] Add user ID to name resolution ✅
- [x] Test with sample data ✅

### Step 6: Analytics Routes (2 hours) ✅
- [x] Create analytics service ✅
- [x] Implement aggregation logic ✅
- [x] Add caching ✅
- [x] Test calculations ✅

### Step 7: Message Routes (2 hours) ✅
- [x] Create Message model ✅
- [x] Implement chat endpoints ✅
- [x] Add WebSocket support ✅
- [x] Test real-time messaging ✅

### Step 8: Notification Routes (2 hours) ✅
- [x] Create Notification model ✅
- [x] Implement cron jobs ✅
- [x] Integrate Expo Push API ✅
- [x] Test notifications ✅

### Step 9: Testing & Documentation (2 hours) ✅
- [x] Test all endpoints ✅
- [x] Add Swagger documentation ✅
- [x] Create API docs ✅
- [x] Fix bugs ✅

---

## ⏱️ Total Estimated Time: **16-18 hours** (2-3 days)

---

## 🔗 Integration Points

### With Expo App
- REST API endpoints for all features
- WebSocket for real-time updates
- Push notification tokens
- Better Auth session management
- All data stored in MongoDB (no blockchain)

---

## 📝 Notes

- **Better Auth:** Works with Expo via REST API (no native modules)
- **MongoDB:** Free tier (512MB) sufficient for MVP
- **No Wallet/Blockchain:** This branch uses traditional user IDs only
- **User Mapping:** All relationships use `userId` from Better Auth
- **Cron Jobs:** Run on server, not client
- **WebSockets:** Optional but recommended for real-time chat
- **Security:** All routes protected except signup/login (Better Auth handles)
- **Validation:** Use Zod for request validation

---

**Ready for implementation!** 🚀

