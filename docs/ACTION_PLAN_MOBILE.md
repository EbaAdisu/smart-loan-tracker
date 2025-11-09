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
1. **Signup:** `POST /api/auth/signup` (email, password, name)
2. **Login:** `POST /api/auth/login` (email, password)
3. **Session:** `GET /api/auth/session` (check if logged in)
4. **Logout:** `POST /api/auth/logout`

### Token Storage
- Store session token in **Expo SecureStore**
- Auto-refresh session on app start
- Clear token on logout

### Auth State Management
- Redux slice for auth state (isAuthenticated, user, token)
- Protected routes using navigation guards
- Auto-redirect to login if session expired

---

## 📱 Screen Implementation

### 1. Auth Screens

#### LoginScreen
- Email input
- Password input
- "Forgot Password?" link
- Login button
- "Don't have account? Sign up" link

#### SignupScreen
- Name input
- Email input
- Password input
- Confirm password input
- Signup button
- "Already have account? Login" link

#### ForgotPasswordScreen
- Email input
- Send reset link button

---

### 2. Loan Screens

#### LoanListScreen
- List of all loans (given + received)
- Filter tabs: "All", "Given", "Received", "Active", "Overdue"
- Search bar
- Pull to refresh
- "Create Loan" FAB button
- Each loan shows: name, amount, status, due date

#### LoanDetailScreen
- Loan details (lender, borrower, amount, reason, dates)
- Status badge
- Payment history list
- "Record Payment" button
- "Edit Loan" button (if owner)
- "Send Message" button
- Payment progress indicator

#### CreateLoanScreen
- Form fields:
  - Borrower selection (search users)
  - Amount input
  - Reason input
  - Due date picker
- Validation
- Submit button

#### EditLoanScreen
- Pre-filled form
- Update amount, reason, due date, status
- Save button

---

### 3. Payment Screens

#### RecordPaymentScreen
- Loan info display
- Amount input
- Notes input (optional)
- Submit button
- Updates loan balance automatically

---

### 4. Analytics Screens

#### AnalyticsScreen
- Summary cards:
  - Total Given
  - Total Received
  - Net Position (positive/negative)
  - Active Loans Count
- Monthly chart
- Yearly summary
- Category breakdown
- Time period selector (monthly/yearly)

#### AnalyticsDetailScreen
- Detailed breakdown by category
- Loan list for selected category
- Export option (future)

---

### 5. Message Screens

#### MessageListScreen
- List of loan conversations
- Unread message indicator
- Last message preview
- Timestamp
- Tap to open chat

#### ChatScreen
- Message list (scrollable)
- Input field
- Send button
- Real-time updates (WebSocket)
- Mark as read on open

---

### 6. Profile Screens

#### ProfileScreen
- User info (name, email, profile picture)
- Statistics (total loans, net position)
- Settings button
- Logout button

#### EditProfileScreen
- Name input
- Profile picture picker
- Save button

---

### 7. Notification Screen

#### NotificationsScreen
- List of notifications
- Unread indicator
- Tap to navigate to related loan
- Mark as read
- Clear all button

---

## 🔄 State Management (Redux Toolkit)

### Auth Slice
```typescript
{
  isAuthenticated: boolean,
  user: User | null,
  token: string | null,
  loading: boolean
}
```

### User Slice
```typescript
{
  profile: UserProfile | null,
  deviceToken: string | null
}
```

### Loan Slice
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
```typescript
{
  notifications: Notification[],
  unreadCount: number
}
```

---

## 🌐 API Integration (RTK Query)

### Base API Setup
- Base URL: `process.env.EXPO_PUBLIC_API_URL`
- Auth headers: Include session token
- Error handling: Global error handler
- Auto-refresh: Handle token refresh

### API Endpoints

#### Auth API
- `signup` - Create account
- `login` - Login
- `logout` - Logout
- `getSession` - Get current session

#### User API
- `getProfile` - Get user profile
- `updateProfile` - Update profile
- `searchUsers` - Search users by name/email
- `registerDeviceToken` - Register push token

#### Loan API
- `getLoans` - Get all loans
- `getLoan` - Get loan by ID
- `createLoan` - Create new loan
- `updateLoan` - Update loan
- `deleteLoan` - Delete loan

#### Payment API
- `recordPayment` - Record payment

#### Analytics API
- `getSummary` - Get analytics summary
- `getMonthly` - Get monthly analytics
- `getYearly` - Get yearly analytics
- `getCategories` - Get category breakdown

#### Message API
- `getMessages` - Get messages for loan
- `sendMessage` - Send message
- `markAsRead` - Mark message as read

#### Notification API
- `getNotifications` - Get notifications
- `markAsRead` - Mark notification as read
- `deleteNotification` - Delete notification

---

## 🔔 Push Notifications

### Setup
1. Request notification permissions
2. Get Expo push token
3. Register token with backend (`POST /api/users/device-token`)
4. Listen for notifications

### Notification Types
- Loan due (3 days before)
- Loan overdue
- Payment received
- New message
- Loan status changed

### Handling
- Show local notification
- Update Redux state
- Navigate to relevant screen on tap

---

## 💬 Real-time Chat (WebSocket)

### Setup
1. Connect to WebSocket on app start (if authenticated)
2. Listen for new messages
3. Update message list in real-time
4. Show notification badge

### Events
- `new_message` - New message received
- `message_read` - Message read by recipient
- `user_online` - User came online
- `user_offline` - User went offline

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
1. Initialize Expo project: `npx create-expo-app@latest`
2. Install dependencies
3. Setup TypeScript
4. Create folder structure
5. Setup navigation structure

### Step 2: Better Auth Integration (2 hours)
1. Create auth service (API calls)
2. Setup Redux auth slice
3. Create auth screens (Login, Signup)
4. Setup navigation guards
5. Test login/signup flow

### Step 3: User Profile (2 hours)
1. Create user API service
2. Setup Redux user slice
3. Create profile screens
4. Implement profile update
5. Test profile flow

### Step 4: Loan List & Detail (3 hours)
1. Create loan API service
2. Setup Redux loan slice
3. Create LoanListScreen
4. Create LoanDetailScreen
5. Implement filters and search
6. Test loan display

### Step 5: Create/Edit Loan (2 hours)
1. Create loan form (React Hook Form)
2. User search/selection
3. Date picker integration
4. Form validation
5. Submit to API
6. Test create/edit flow

### Step 6: Payment Recording (1 hour)
1. Create payment API service
2. Create RecordPaymentScreen
3. Update loan balance
4. Test payment flow

### Step 7: Analytics (3 hours)
1. Create analytics API service
2. Create AnalyticsScreen
3. Implement charts (react-native-chart-kit or similar)
4. Monthly/yearly views
5. Category breakdown
6. Test analytics display

### Step 8: Messaging (3 hours)
1. Setup WebSocket connection
2. Create message API service
3. Create MessageListScreen
4. Create ChatScreen
5. Real-time message updates
6. Test chat flow

### Step 9: Notifications (2 hours)
1. Setup Expo Notifications
2. Request permissions
3. Register device token
4. Create NotificationsScreen
5. Handle notification taps
6. Test notifications

### Step 10: Polish & Testing (3 hours)
1. Add loading states
2. Error handling
3. Pull to refresh
4. Offline handling (cache)
5. UI/UX improvements
6. Test all flows

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
EXPO_PUBLIC_WS_URL=ws://localhost:3000
```

### Authentication
- All API calls include session token (Better Auth handles)
- Token stored in SecureStore
- Auto-refresh on 401 errors

---

## 📝 Key Features

### 1. Offline Support
- Cache loans in AsyncStorage
- Show cached data when offline
- Sync when back online

### 2. Pull to Refresh
- Loan list
- Message list
- Notifications

### 3. Search & Filter
- Search loans by name/amount
- Filter by status/type
- Search users for loan creation

### 4. Real-time Updates
- New messages (WebSocket)
- Loan status changes (polling or WebSocket)
- Notifications (push)

### 5. Form Validation
- React Hook Form + Zod
- Client-side validation
- Error messages

---

## 🎨 UI/UX Guidelines

### Design System
- Use React Native Paper theme
- Consistent colors, spacing, typography
- Dark mode support (optional)

### Navigation
- Bottom tabs: Loans, Analytics, Messages, Profile
- Stack navigation for details
- Modal for create/edit

### Loading States
- Skeleton loaders
- Loading spinners
- Pull to refresh indicators

### Error Handling
- Toast messages for errors
- Retry buttons
- Empty states

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

