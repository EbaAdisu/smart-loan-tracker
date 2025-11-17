# Smart Loan Tracker – Backend Functional Requirements

## 1. Platform Overview
- Backend built with `Elysia` (Bun-compatible) running on Node, exposing REST and WebSocket interfaces.
- Data persistence via MongoDB (Mongoose models) with Better Auth’s Mongo adapter sharing the same cluster.
- Authentication and session lifecycle powered by **Better Auth** (email + password) with 7-day rolling sessions.
- Push notifications delivered through Expo’s push service; device tokens stored per user.
- Scheduled automation handled with `node-cron`; real-time fan-out via WebSockets.
- All APIs are mounted under `/api` with Swagger documentation enabled for discovery.

## 2. Authentication & User Management
- Better Auth handles signup, login, session issuance, password reset, etc., behind `/api/auth/*`.
- Custom signup callback (`/api/auth/signup/callback`) must be triggered after Better Auth registration to create an extended profile document.
- Requests that require identity include `better-auth.session_token` (cookie or bearer token). The `authMiddleware` must validate session freshness through Better Auth’s session API before any controller logic runs.
- User profiles extend Better Auth users with:
  - `profilePicture`
  - Expo `deviceTokens` array for push notifications
  - `lastLogin` timestamp (kept current on successful sign-ins)
- Device token management endpoints:
  - Register (`POST /api/users/device-token`) to upsert Expo tokens.
  - Removing tokens is supported by the profile service for logout/uninstall flows.
- User discovery:
  - `GET /api/users/search?q=` performs regex search over Better Auth’s `user` collection by name or email.
  - `GET /api/users/:userId` returns Better Auth core data plus extended profile metadata.

## 3. Domain Models

| Model | Key Fields | Purpose |
| --- | --- | --- |
| `UserProfile` | `userId`, `profilePicture`, `deviceTokens[]`, `lastLogin`, timestamps | Extends Better Auth user with app-specific metadata and push settings. |
| `Loan` | `loanId`, `lenderUserId`, `borrowerUserId`, `lenderName`, `borrowerName`, `amount`, `reason`, `dueDate`, `status` (`pending`, `active`, `completed`, `overdue`, `cancelled`), `balanceRemaining` | Core loan contract between two Better Auth users. Tracks lifecycle, remaining balance, and derived status helpers (`isOverdue`, `isCompleted`). |
| `Payment` | `loanId`, `amount`, `timestamp` | Immutable ledger of payments applied toward a loan; feeds balance updates and analytics. |
| `Message` | `loanId`, `senderUserId`, `receiverUserId`, `senderName`, `content`, `read`, `createdAt` | Persisted chat thread entries scoped to a loan relationship with unread tracking. |
| `Notification` | `userId`, `type` (`loan_due`, `loan_overdue`, `payment_received`, `new_message`, `status_change`), `title`, `body`, optional `loanId`, `read`, `createdAt` | Records in-app notifications and mirrors push notifications sent through Expo. |

Additional computed data (loan stats, analytics summaries) are generated on demand and not stored as dedicated collections.

## 4. Loan Lifecycle & Payments
- **Create** (`POST /api/loans`): Any authenticated user can author a loan specifying lender/borrower IDs, names, amount, reason, due date. System generates `loanId`, initializes `balanceRemaining`, and defaults status to `active`.
- **Retrieve**:
  - `GET /api/loans` supports filters by `status` and `role` (lender, borrower, or both).
  - `GET /api/loans/:loanId` enforces that only lender or borrower can view.
- **Update**:
  - `PUT /api/loans/:loanId` allows either party to adjust status, amount, reason, due date, or manually tweak `balanceRemaining`.
  - `POST /api/loans/:loanId/accept` transitions a pending loan to active (borrower-only).
- **Payments**:
  - `POST /api/loans/:loanId/payments` records a payment, writes a `Payment` entry, decrements `balanceRemaining`, and auto-closes the loan if the balance hits zero.
  - `GET /api/loans/:loanId/payments` returns chronological payment history.
- **Deletion**:
  - `DELETE /api/loans/:loanId` performs a soft delete by marking status `cancelled`; enforced to lender/borrower only.
- Automatic state management:
  - Overdue detection (`loan.isOverdue()`) is leveraged by cron jobs to move loans into `overdue`.
  - Completion is inferred when balance reaches zero (`loan.updateBalance`).

## 5. Messaging Requirements
- Messaging is restricted to users engaged in a shared loan.
- `POST /api/messages` creates a chat message, auto-identifies receiver as the opposite party, and stores sender display name from the loan snapshot.
- `GET /api/messages/loans/:loanId` fetches entire thread; `MessageService` returns chronological order.
- Unread indicators:
  - `GET /api/messages/unread-count` returns total unread messages per user.
  - `GET /api/messages/recent?limit=` aggregates recent conversations with unread counts per loan.
- Messages can be marked read in bulk per loan via service-level operations (invoked when user views thread).

## 6. Notification & Push Requirements
- Creation triggers:
  - Manual through service calls (loan status change, payment received, new message).
  - Automated via cron when loans near or pass due dates.
- `GET /api/notifications` returns latest notifications; optional `limit`.
- `GET /api/notifications/unread-count` surfaces badge totals.
- `POST /api/notifications/mark-read` toggles individual notifications to `read`.
- Push delivery:
  - Only valid Expo tokens (validated via `Expo.isExpoPushToken`) are used.
  - Payload includes `loanId` so clients can deep link into context.
  - Failures to send push do not prevent notification persistence.

## 7. Analytics & Reporting
- `GET /api/analytics/summary`: totals for loans given/received, net position, active/completed counts, outstanding balance, average loan amount.
- `GET /api/analytics/monthly?month=YYYY-MM`: month-scoped totals for given/received amounts, count of loans originated, payments made/received.
- `GET /api/analytics/yearly?year=`: returns array of 12 monthly breakdowns for the requested year.
- `GET /api/analytics/categories`: aggregates total amount and frequency per loan `reason`.
- Analytics always scope to loans where the authenticated user is either lender or borrower.

## 8. Real-Time Channel (WebSocket `/ws`)
- Supports event fan-out for:
  - `new_message`: deliver new chat entries to the opposite participant.
  - `new_notification`: deliver notification previews to targeted users.
  - `loan_status_changed`: inform parties in a specific loan room about state transitions.
  - `user_status_changed`: broadcast presence updates (online/offline) globally.
- Server tracks active connections per-user in memory via `registerConnection`/`unregisterConnection`.
- WebSocket auth expectations: clients are expected to authenticate before registering; middleware stub exists to integrate Better Auth token validation if desired.

## 9. Scheduled Automation
- **Daily 09:00 UTC – Due Soon Check**
  - Retrieves loans due within next 3 days and sends `loan_due` notifications to borrowers (days remaining included).
- **Daily 09:00 UTC – Overdue Check**
  - Finds loans past due still marked `active` or `pending`, flags them `overdue`, and notifies both parties.
- **Daily 02:00 UTC – Analytics Aggregation (placeholder)**
  - Currently logs execution; reserved for future pre-computation/caching of heavy analytics queries.
- Cron jobs are started when the server boots and halted on graceful shutdown signals.

## 10. Error Handling & Validation Expectations
- Request bodies and query params are validated with `elysia` + `t` schemas on each route.
- Centralized error middleware translates `AppError` derivatives (400–503) into structured JSON: `{ success: false, error: { message, statusCode, code } }`.
- Authentication failures always respond with 401 and halt controller execution.

## 11. Non-Functional Considerations
- CORS origins configurable through `CORS_ORIGIN`, allowing multiple comma-separated mobile/web clients.
- Better Auth requires `BETTER_AUTH_SECRET` (≥32 chars) and `BETTER_AUTH_URL` pointing to backend base URL for callback construction.
- Expo push support depends on optional `EXPO_ACCESS_TOKEN`; push delivery is best-effort.
- Swagger documentation (auto-generated) should remain accurate whenever routes change to keep API reference discoverable.

