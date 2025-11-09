# API Documentation - Smart Loan Tracker

Base URL: `http://localhost:3000/api`

## 🔐 Authentication

All endpoints except auth routes require authentication via Better Auth session token.

### Headers
```
Authorization: Bearer <session-token>
```
OR
```
Cookie: better-auth.session_token=<token>
```

---

## 📚 Endpoints

### Authentication (`/api/auth/*`)

Better Auth automatically handles these endpoints:

#### POST `/api/auth/sign-up/email`
Create new account with email/password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "token": "session_token_here",
    "expiresAt": "2024-01-01T00:00:00Z"
  }
}
```

#### POST `/api/auth/sign-in/email`
Login with email/password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### POST `/api/auth/sign-out`
Logout current session.

#### GET `/api/auth/get-session`
Get current session info.

---

### Users (`/api/users/*`)

#### GET `/api/users/me`
Get current user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "profilePicture": "https://...",
    "deviceTokens": ["token1", "token2"],
    "createdAt": "2024-01-01T00:00:00Z",
    "lastLogin": "2024-01-02T00:00:00Z"
  }
}
```

#### PUT `/api/users/me`
Update current user profile.

**Request:**
```json
{
  "name": "Jane Doe",
  "profilePicture": "https://..."
}
```

#### POST `/api/users/device-token`
Register device token for push notifications.

**Request:**
```json
{
  "token": "ExponentPushToken[xxxxx]"
}
```

#### GET `/api/users/search?q=john`
Search users by name or email.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user_456",
      "name": "John Smith",
      "email": "john@example.com",
      "image": null
    }
  ]
}
```

#### GET `/api/users/:userId`
Get user by ID.

---

### Loans (`/api/loans/*`)

#### POST `/api/loans`
Create new loan.

**Request:**
```json
{
  "lenderUserId": "user_123",
  "borrowerUserId": "user_456",
  "lenderName": "John Doe",
  "borrowerName": "Jane Smith",
  "amount": 1000,
  "reason": "Medical expenses",
  "dueDate": "2024-12-31T00:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "loanId": "LOAN-ABC123",
    "lenderUserId": "user_123",
    "borrowerUserId": "user_456",
    "amount": 1000,
    "balanceRemaining": 1000,
    "status": "active",
    "dateCreated": "2024-01-01T00:00:00Z",
    "dueDate": "2024-12-31T00:00:00Z"
  }
}
```

#### GET `/api/loans?status=active&role=lender`
Get all loans for current user.

**Query Parameters:**
- `status`: `pending`, `active`, `completed`, `overdue`, `cancelled`
- `role`: `lender`, `borrower`, `all`

#### GET `/api/loans/:loanId`
Get loan details.

#### PUT `/api/loans/:loanId`
Update loan.

**Request:**
```json
{
  "amount": 1200,
  "dueDate": "2024-12-31T00:00:00Z",
  "status": "completed"
}
```

#### DELETE `/api/loans/:loanId`
Delete loan (soft delete - sets status to cancelled).

#### POST `/api/loans/:loanId/payments`
Add payment to loan.

**Request:**
```json
{
  "amount": 500
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "loanId": "LOAN-ABC123",
    "balanceRemaining": 500,
    "status": "active"
  }
}
```

#### GET `/api/loans/:loanId/payments`
Get payment history for loan.

---

### Analytics (`/api/analytics/*`)

#### GET `/api/analytics/summary`
Get overall analytics summary.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalGiven": 5000,
    "totalReceived": 3000,
    "netPosition": 2000,
    "activeLoansCount": 5,
    "completedLoansCount": 10,
    "totalOutstanding": 2500,
    "averageLoanAmount": 800
  }
}
```

#### GET `/api/analytics/monthly?month=2024-01`
Get monthly breakdown.

**Query:** `month` format: `YYYY-MM`

**Response:**
```json
{
  "success": true,
  "data": {
    "month": "2024-01",
    "totalGiven": 1000,
    "totalReceived": 500,
    "loansGiven": 3,
    "loansReceived": 2,
    "paymentsReceived": 5,
    "paymentsMade": 3
  }
}
```

#### GET `/api/analytics/yearly?year=2024`
Get yearly summary (returns 12 months data).

#### GET `/api/analytics/categories`
Get breakdown by loan reason/category.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "reason": "Medical expenses",
      "count": 5,
      "totalAmount": 5000
    },
    {
      "reason": "Education",
      "count": 3,
      "totalAmount": 3000
    }
  ]
}
```

---

### Messages (`/api/messages/*`)

#### GET `/api/messages/loans/:loanId?limit=50`
Get messages for a loan.

#### POST `/api/messages`
Send a message.

**Request:**
```json
{
  "loanId": "LOAN-ABC123",
  "content": "Hello, when can you repay?"
}
```

#### PUT `/api/messages/:messageId/read`
Mark message as read.

#### GET `/api/messages/unread-count`
Get unread message count.

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

#### GET `/api/messages/conversations?limit=10`
Get recent conversations.

---

### Notifications (`/api/notifications/*`)

#### GET `/api/notifications?read=false&type=loan_due&limit=50`
Get user notifications.

**Query Parameters:**
- `read`: `true` or `false`
- `type`: `loan_due`, `loan_overdue`, `payment_received`, `new_message`, `status_change`
- `limit`: number (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "notif_123",
      "userId": "user_123",
      "type": "loan_due",
      "title": "Loan Due Soon",
      "body": "You have a loan due in 3 days",
      "loanId": "LOAN-ABC123",
      "read": false,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### GET `/api/notifications/unread-count`
Get unread notification count.

#### PUT `/api/notifications/:id/read`
Mark notification as read.

#### PUT `/api/notifications/read-all`
Mark all notifications as read.

#### DELETE `/api/notifications/:id`
Delete notification.

---

## 🔌 WebSocket

Connect to: `ws://localhost:3000/ws`

### Events

#### Client → Server

**Send Message:**
```json
{
  "type": "message",
  "userId": "user_456",
  "loanId": "LOAN-ABC123",
  "data": {
    "content": "Hello!"
  }
}
```

**User Status:**
```json
{
  "type": "user_status",
  "userId": "user_123",
  "data": {
    "status": "online"
  }
}
```

#### Server → Client

**New Message:**
```json
{
  "type": "new_message",
  "data": {
    "loanId": "LOAN-ABC123",
    "senderUserId": "user_456",
    "content": "Hello!"
  }
}
```

**New Notification:**
```json
{
  "type": "new_notification",
  "data": {
    "title": "Loan Due Soon",
    "body": "You have a loan due in 3 days"
  }
}
```

**Loan Status Changed:**
```json
{
  "type": "loan_status_changed",
  "data": {
    "loanId": "LOAN-ABC123",
    "status": "completed"
  }
}
```

---

## 🚨 Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Status Codes
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

---

## 📝 Rate Limiting

Currently no rate limiting implemented. Recommended for production:
- Auth endpoints: 5 req/min
- API endpoints: 100 req/min
- WebSocket: 50 msg/min

---

## 🧪 Testing

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Get Profile:**
```bash
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

### Using Swagger UI

Visit: `http://localhost:3000/swagger`

---

## 💡 Best Practices

1. **Always handle errors** on the client side
2. **Store session tokens securely** (use secure storage)
3. **Implement retry logic** for failed requests
4. **Use WebSocket** for real-time features
5. **Validate data** before sending to API
6. **Handle token expiration** gracefully

