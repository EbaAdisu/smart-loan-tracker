# 📱 Mobile App Action Plan - Expo React Native

## 📋 Overview
React Native mobile app using **Expo** that connects to Elysia.js backend. Uses **Better Auth** for authentication, **Redux Toolkit** for state management, and implements all loan tracking features.

---

## 🛠️ Tech Stack

### Core
- **Framework:** React Native (Expo SDK 51+)
- **State Management:** Redux Toolkit + RTK Query
- **Navigation:** React Navigation v6
- **Auth:** Better Auth (via REST API)
- **HTTP Client:** Axios or Fetch
- **Storage:** Expo SecureStore (tokens), AsyncStorage (cache)

### UI/UX
- **UI Library:** React Native Paper or NativeBase
- **Icons:** Expo Vector Icons
- **Forms:** React Hook Form + Zod validation
- **Date Picker:** @react-native-community/datetimepicker

### Additional
- **Notifications:** Expo Notifications API
- **WebSocket:** Socket.io-client (for real-time chat)
- **Image Picker:** Expo Image Picker (profile pictures)

---

## 📁 Project Structure

```
mobile/
├── src/
│   ├── App.tsx                    # Root component
│   ├── navigation/
│   │   ├── AppNavigator.tsx       # Main navigation
│   │   ├── AuthNavigator.tsx      # Auth screens
│   │   └── MainNavigator.tsx      # Authenticated screens
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignupScreen.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   ├── loans/
│   │   │   ├── LoanListScreen.tsx
│   │   │   ├── LoanDetailScreen.tsx
│   │   │   ├── CreateLoanScreen.tsx
│   │   │   └── EditLoanScreen.tsx
│   │   ├── payments/
│   │   │   └── RecordPaymentScreen.tsx
│   │   ├── analytics/
│   │   │   ├── AnalyticsScreen.tsx
│   │   │   └── AnalyticsDetailScreen.tsx
│   │   ├── messages/
│   │   │   ├── MessageListScreen.tsx
│   │   │   └── ChatScreen.tsx
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── EditProfileScreen.tsx
│   │   └── notifications/
│   │       └── NotificationsScreen.tsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── loans/
│   │   │   ├── LoanCard.tsx
│   │   │   └── LoanStatusBadge.tsx
│   │   └── analytics/
│   │       └── Chart.tsx
│   ├── services/
│   │   ├── api/
│   │   │   ├── authApi.ts          # Better Auth endpoints
│   │   │   ├── userApi.ts          # User endpoints
│   │   │   ├── loanApi.ts          # Loan endpoints
│   │   │   ├── analyticsApi.ts     # Analytics endpoints
│   │   │   ├── messageApi.ts       # Message endpoints
│   │   │   └── notificationApi.ts  # Notification endpoints
│   │   ├── auth.service.ts         # Auth logic wrapper
│   │   ├── storage.service.ts      # SecureStore/AsyncStorage
│   │   ├── notification.service.ts # Push notifications
│   │   └── websocket.service.ts    # Real-time chat
│   ├── store/
│   │   ├── index.ts                # Store configuration
│   │   ├── slices/
│   │   │   ├── authSlice.ts        # Auth state
│   │   │   ├── userSlice.ts        # User profile
│   │   │   ├── loanSlice.ts        # Loans
│   │   │   └── notificationSlice.ts # Notifications
│   │   └── api/
│   │       ├── baseApi.ts          # RTK Query base
│   │       └── endpoints/           # API endpoints
│   ├── hooks/
│   │   ├── useAuth.ts              # Auth hook
│   │   ├── useLoans.ts             # Loans hook
│   │   └── useNotifications.ts     # Notifications hook
│   ├── utils/
│   │   ├── constants.ts            # App constants
│   │   ├── formatters.ts           # Date/currency formatters
│   │   └── validators.ts           # Form validation
│   └── types/
│       ├── auth.types.ts           # Auth types
│       ├── loan.types.ts           # Loan types
│       └── api.types.ts            # API response types
├── app.json                        # Expo config
├── package.json
└── tsconfig.json
```

---

## 🔐 Authentication Flow

### Better Auth Integration
- [ ] **Signup:** `POST /api/auth/signup` (email, password, name)
- [ ] **Login:** `POST /api/auth/login` (email, password)
- [ ] **Session:** `GET /api/auth/session` (check if logged in)
- [ ] **Logout:** `POST /api/auth/logout`

### Token Storage
- [ ] Store session token in **Expo SecureStore**
- [ ] Auto-refresh session on app start
- [ ] Clear token on logout

### Auth State Management
- [ ] Redux slice for auth state (isAuthenticated, user, token)
- [ ] Protected routes using navigation guards
- [ ] Auto-redirect to login if session expired

---

## 📱 Screen Implementation

### 1. Auth Screens

#### LoginScreen
- [ ] Email input
- [ ] Password input
- [ ] "Forgot Password?" link
- [ ] Login button
- [ ] "Don't have account? Sign up" link

#### SignupScreen
- [ ] Name input
- [ ] Email input
- [ ] Password input
- [ ] Confirm password input
- [ ] Signup button
- [ ] "Already have account? Login" link

#### ForgotPasswordScreen
- [ ] Email input
- [ ] Send reset link button

---

### 2. Loan Screens

#### LoanListScreen
- [ ] List of all loans (given + received)
- [ ] Filter tabs: "All", "Given", "Received", "Active", "Overdue"
- [ ] Search bar
- [ ] Pull to refresh
- [ ] "Create Loan" FAB button
- [ ] Each loan shows: name, amount, status, due date

#### LoanDetailScreen
- [ ] Loan details (lender, borrower, amount, reason, dates)
- [ ] Status badge
- [ ] Payment history list
- [ ] "Record Payment" button
- [ ] "Edit Loan" button (if owner)
- [ ] "Send Message" button
- [ ] Payment progress indicator

#### CreateLoanScreen
- [ ] Form fields:
  - [ ] Borrower selection (search users)
  - [ ] Amount input
  - [ ] Reason input
  - [ ] Due date picker
- [ ] Validation
- [ ] Submit button

#### EditLoanScreen
- [ ] Pre-filled form
- [ ] Update amount, reason, due date, status
- [ ] Save button

---

### 3. Payment Screens

#### RecordPaymentScreen
- [ ] Loan info display
- [ ] Amount input
- [ ] Notes input (optional)
- [ ] Submit button
- [ ] Updates loan balance automatically

---

### 4. Analytics Screens

#### AnalyticsScreen
- [ ] Summary cards:
  - [ ] Total Given
  - [ ] Total Received
  - [ ] Net Position (positive/negative)
  - [ ] Active Loans Count
- [ ] Monthly chart
- [ ] Yearly summary
- [ ] Category breakdown
- [ ] Time period selector (monthly/yearly)

#### AnalyticsDetailScreen
- [ ] Detailed breakdown by category
- [ ] Loan list for selected category
- [ ] Export option (future)

---

### 5. Message Screens

#### MessageListScreen
- [ ] List of loan conversations
- [ ] Unread message indicator
- [ ] Last message preview
- [ ] Timestamp
- [ ] Tap to open chat

#### ChatScreen
- [ ] Message list (scrollable)
- [ ] Input field
- [ ] Send button
- [ ] Real-time updates (WebSocket)
- [ ] Mark as read on open

---

### 6. Profile Screens

#### ProfileScreen
- [ ] User info (name, email, profile picture)
- [ ] Statistics (total loans, net position)
- [ ] Settings button
- [ ] Logout button

#### EditProfileScreen
- [ ] Name input
- [ ] Profile picture picker
- [ ] Save button

---

### 7. Notification Screen

#### NotificationsScreen
- [ ] List of notifications
- [ ] Unread indicator
- [ ] Tap to navigate to related loan
- [ ] Mark as read
- [ ] Clear all button

---

## 🔄 State Management (Redux Toolkit)

### Auth Slice
- [ ] Implement auth slice
```typescript
{
  isAuthenticated: boolean,
  user: User | null,
  token: string | null,
  loading: boolean
}
```

### User Slice
- [ ] Implement user slice
```typescript
{
  profile: UserProfile | null,
  deviceToken: string | null
}
```

### Loan Slice
- [ ] Implement loan slice
```typescript
{
  loans: Loan[],
  selectedLoan: Loan | null,
  filters: {
    type: 'all' | 'given' | 'received',
    status: 'all' | 'active' | 'overdue' | 'completed'
  }
}
```

### Notification Slice
- [ ] Implement notification slice
```typescript
{
  notifications: Notification[],
  unreadCount: number
}
```

---

## 🌐 API Integration (RTK Query)

### Base API Setup
- [ ] Base URL: `process.env.EXPO_PUBLIC_API_URL`
- [ ] Auth headers: Include session token
- [ ] Error handling: Global error handler
- [ ] Auto-refresh: Handle token refresh

### API Endpoints

#### Auth API
- [ ] `signup` - Create account
- [ ] `login` - Login
- [ ] `logout` - Logout
- [ ] `getSession` - Get current session

#### User API
- [ ] `getProfile` - Get user profile
- [ ] `updateProfile` - Update profile
- [ ] `searchUsers` - Search users by name/email
- [ ] `registerDeviceToken` - Register push token

#### Loan API
- [ ] `getLoans` - Get all loans
- [ ] `getLoan` - Get loan by ID
- [ ] `createLoan` - Create new loan
- [ ] `updateLoan` - Update loan
- [ ] `deleteLoan` - Delete loan

#### Payment API
- [ ] `recordPayment` - Record payment

#### Analytics API
- [ ] `getSummary` - Get analytics summary
- [ ] `getMonthly` - Get monthly analytics
- [ ] `getYearly` - Get yearly analytics
- [ ] `getCategories` - Get category breakdown

#### Message API
- [ ] `getMessages` - Get messages for loan
- [ ] `sendMessage` - Send message
- [ ] `markAsRead` - Mark message as read

#### Notification API
- [ ] `getNotifications` - Get notifications
- [ ] `markAsRead` - Mark notification as read
- [ ] `deleteNotification` - Delete notification

---

## 🔔 Push Notifications

### Setup
- [ ] Request notification permissions
- [ ] Get Expo push token
- [ ] Register token with backend (`POST /api/users/device-token`)
- [ ] Listen for notifications

### Notification Types
- [ ] Loan due (3 days before)
- [ ] Loan overdue
- [ ] Payment received
- [ ] New message
- [ ] Loan status changed

### Handling
- [ ] Show local notification
- [ ] Update Redux state
- [ ] Navigate to relevant screen on tap

---

## 💬 Real-time Chat (WebSocket)

### Setup
- [ ] Connect to WebSocket on app start (if authenticated)
- [ ] Listen for new messages
- [ ] Update message list in real-time
- [ ] Show notification badge

### Events
- [ ] `new_message` - New message received
- [ ] `message_read` - Message read by recipient
- [ ] `user_online` - User came online
- [ ] `user_offline` - User went offline

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "expo": "~51.0.0",
    "react": "18.2.0",
    "react-native": "0.74.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "react-native-paper": "^5.11.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "expo-secure-store": "~13.0.0",
    "@react-native-async-storage/async-storage": "1.23.0",
    "expo-notifications": "~0.28.0",
    "expo-image-picker": "~15.0.0",
    "@react-native-community/datetimepicker": "8.0.0",
    "socket.io-client": "^4.7.0",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@types/react": "~18.2.0",
    "@types/react-native": "~0.73.0",
    "typescript": "~5.3.0"
  }
}
```

---

## 🚀 Implementation Steps

### Step 1: Project Setup (1 hour)
- [ ] Initialize Expo project: `npx create-expo-app@latest`
- [ ] Install dependencies
- [ ] Setup TypeScript
- [ ] Create folder structure
- [ ] Setup navigation structure

### Step 2: Better Auth Integration (2 hours)
- [ ] Create auth service (API calls)
- [ ] Setup Redux auth slice
- [ ] Create auth screens (Login, Signup)
- [ ] Setup navigation guards
- [ ] Test login/signup flow

### Step 3: User Profile (2 hours)
- [ ] Create user API service
- [ ] Setup Redux user slice
- [ ] Create profile screens
- [ ] Implement profile update
- [ ] Test profile flow

### Step 4: Loan List & Detail (3 hours)
- [ ] Create loan API service
- [ ] Setup Redux loan slice
- [ ] Create LoanListScreen
- [ ] Create LoanDetailScreen
- [ ] Implement filters and search
- [ ] Test loan display

### Step 5: Create/Edit Loan (2 hours)
- [ ] Create loan form (React Hook Form)
- [ ] User search/selection
- [ ] Date picker integration
- [ ] Form validation
- [ ] Submit to API
- [ ] Test create/edit flow

### Step 6: Payment Recording (1 hour)
- [ ] Create payment API service
- [ ] Create RecordPaymentScreen
- [ ] Update loan balance
- [ ] Test payment flow

### Step 7: Analytics (3 hours)
- [ ] Create analytics API service
- [ ] Create AnalyticsScreen
- [ ] Implement charts (react-native-chart-kit or similar)
- [ ] Monthly/yearly views
- [ ] Category breakdown
- [ ] Test analytics display

### Step 8: Messaging (3 hours)
- [ ] Setup WebSocket connection
- [ ] Create message API service
- [ ] Create MessageListScreen
- [ ] Create ChatScreen
- [ ] Real-time message updates
- [ ] Test chat flow

### Step 9: Notifications (2 hours)
- [ ] Setup Expo Notifications
- [ ] Request permissions
- [ ] Register device token
- [ ] Create NotificationsScreen
- [ ] Handle notification taps
- [ ] Test notifications

### Step 10: Polish & Testing (3 hours)
- [ ] Add loading states
- [ ] Error handling
- [ ] Pull to refresh
- [ ] Offline handling (cache)
- [ ] UI/UX improvements
- [ ] Test all flows

---

## ⏱️ Total Estimated Time: **22-24 hours** (3-4 days)

---

## 🔗 Backend Integration

### API Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your-backend.com/api`

### Environment Variables
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_WS_URL=ws://localhost:3000/ws
```

### Authentication
- Better Auth handles all auth endpoints
- Session token stored in cookies (Better Auth manages)
- Include cookies in requests (credentials: true)
- Base URL: `http://localhost:3000/api/auth`

### API Endpoints

#### Auth (`/api/auth`)
- `POST /auth/sign-up/email` - Signup (email, password, name)
- `POST /auth/sign-in/email` - Login (email, password)
- `POST /auth/sign-out` - Logout
- `GET /auth/get-session` - Get current session
- `POST /auth/signup/callback` - Create user profile (internal)

#### Users (`/api/users`)
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update profile (name, profilePicture)
- `POST /users/device-token` - Register push token (token)
- `GET /users/search?q=query` - Search users
- `GET /users/:userId` - Get user by ID

#### Loans (`/api/loans`)
- `POST /loans` - Create loan (lenderUserId, borrowerUserId, lenderName, borrowerName, amount, reason?, dueDate)
- `GET /loans` - Get all loans (?status=, ?role=)
- `GET /loans/:loanId` - Get loan by ID
- `PUT /loans/:loanId` - Update loan (status?, amount?, reason?, dueDate?, balanceRemaining?)
- `POST /loans/:loanId/accept` - Accept loan request
- `POST /loans/:loanId/payments` - Record payment (amount)
- `GET /loans/:loanId/payments` - Get payment history
- `DELETE /loans/:loanId` - Delete loan

#### Analytics (`/api/analytics`)
- `GET /analytics/summary` - Get overall summary
- `GET /analytics/monthly?month=YYYY-MM` - Get monthly breakdown
- `GET /analytics/yearly?year=YYYY` - Get yearly summary
- `GET /analytics/categories` - Get category breakdown

#### Messages (`/api/messages`)
- `GET /messages/loans/:loanId` - Get messages for loan
- `POST /messages` - Send message (loanId, content)
- `GET /messages/unread-count` - Get unread count
- `GET /messages/recent?limit=10` - Get recent messages

#### Notifications (`/api/notifications`)
- `GET /notifications?limit=50` - Get all notifications
- `GET /notifications/unread-count` - Get unread count
- `POST /notifications/mark-read` - Mark as read (notificationId)

### Response Format
```typescript
// Success
{
  success: true,
  data: any
}

// Error
{
  success: false,
  error: {
    message: string,
    statusCode: number,
    code: string
  }
}
```

### Status Codes
- `200` - Success (GET, PUT, DELETE)
- `201` - Created (POST)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

---

## 📝 Key Features

### 1. Offline Support
- [ ] Cache loans in AsyncStorage
- [ ] Show cached data when offline
- [ ] Sync when back online

### 2. Pull to Refresh
- [ ] Loan list
- [ ] Message list
- [ ] Notifications

### 3. Search & Filter
- [ ] Search loans by name/amount
- [ ] Filter by status/type
- [ ] Search users for loan creation

### 4. Real-time Updates
- [ ] New messages (WebSocket)
- [ ] Loan status changes (polling or WebSocket)
- [ ] Notifications (push)

### 5. Form Validation
- [ ] React Hook Form + Zod
- [ ] Client-side validation
- [ ] Error messages

---

## 🎨 UI/UX Guidelines

### Design System
- [ ] Use React Native Paper theme
- [ ] Consistent colors, spacing, typography
- [ ] Dark mode support (optional)

### Navigation
- [ ] Bottom tabs: Loans, Analytics, Messages, Profile
- [ ] Stack navigation for details
- [ ] Modal for create/edit

### Loading States
- [ ] Skeleton loaders
- [ ] Loading spinners
- [ ] Pull to refresh indicators

### Error Handling
- [ ] Toast messages for errors
- [ ] Retry buttons
- [ ] Empty states

---

## 📝 Notes

- **Better Auth:** Uses REST API, no native modules needed
- **State Management:** Redux Toolkit for global state, local state for forms
- **Navigation:** React Navigation with type-safe routes
- **API:** RTK Query for caching and auto-refetching
- **Storage:** SecureStore for tokens, AsyncStorage for cache
- **Testing:** Test on iOS and Android simulators
- **Performance:** Optimize list rendering (FlatList), image caching

---

**Ready for implementation!** 🚀

