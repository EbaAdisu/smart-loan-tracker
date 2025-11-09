# Smart Loan Tracker - Backend API

Backend API for the Smart Loan Tracker application built with Elysia.js, MongoDB, and Better Auth.

## 🚀 Features

- **Authentication**: Email/password auth with Better Auth
- **User Management**: Profile management and user search
- **Loan Tracking**: Create, manage, and track loans
- **Analytics**: Comprehensive loan statistics and breakdowns
- **Real-time Chat**: WebSocket-based messaging
- **Push Notifications**: Expo push notifications for due/overdue loans
- **Automated Jobs**: Cron jobs for loan status monitoring

## 📋 Prerequisites

- [Bun](https://bun.sh/) v1.0 or higher
- MongoDB Atlas account (or local MongoDB)
- Node.js v18+ (for compatibility)

## 🛠️ Installation

1. Clone the repository:
```bash
cd backend
```

2. Install dependencies:
```bash
bun install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with:
   - MongoDB connection string
   - Better Auth secret
   - Expo access token (for push notifications)

## 🚀 Running the Application

### Development mode (with hot reload):
```bash
bun run dev
```

### Production mode:
```bash
bun start
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

Once running, visit:
- **Swagger UI**: `http://localhost:3000/swagger`
- **API Base**: `http://localhost:3000/api`

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── index.ts              # Main entry point
│   ├── config/               # Configuration files
│   │   ├── database.ts       # MongoDB connection
│   │   ├── auth.ts           # Better Auth config
│   │   └── env.ts            # Environment variables
│   ├── models/               # Mongoose models
│   │   ├── User.ts
│   │   ├── Loan.ts
│   │   ├── Payment.ts
│   │   ├── Message.ts
│   │   └── Notification.ts
│   ├── routes/               # API routes
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── loans.ts
│   │   ├── analytics.ts
│   │   ├── messages.ts
│   │   └── notifications.ts
│   ├── services/             # Business logic
│   ├── middleware/           # Custom middleware
│   └── utils/                # Utility functions
└── package.json
```

## 🔐 Authentication

This API uses Better Auth for authentication. All routes (except auth endpoints) require authentication.

### Available Auth Endpoints:
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/session` - Get current session
- `POST /api/auth/reset-password` - Reset password

## 📊 Database Models

- **User Profile**: Extended user data (links to Better Auth user)
- **Loan**: Loan records with status tracking
- **Payment**: Payment history for loans
- **Message**: Chat messages between users
- **Notification**: Push notification records

## ⏰ Cron Jobs

The application runs automated jobs:
- **Daily at 9 AM**: Check for due and overdue loans
- **Daily at 2 AM**: Aggregate analytics data

## 🔌 WebSocket Events

Real-time events supported:
- New message received
- Loan status changed
- New notification
- User online/offline status

## 📝 License

MIT License - see LICENSE file for details

