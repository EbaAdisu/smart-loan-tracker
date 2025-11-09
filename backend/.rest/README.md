# REST API Test Files

This folder contains REST client files for testing all API endpoints.

## Files

- `auth.rest` - Authentication endpoints
- `users.rest` - User management endpoints
- `loans.rest` - Loan management endpoints
- `analytics.rest` - Analytics endpoints
- `messages.rest` - Messaging endpoints
- `notifications.rest` - Notification endpoints

## Usage

1. Install REST Client extension in VS Code
2. Set `@authToken` variable with your authentication token
3. Update `@baseUrl` if using different server
4. Click "Send Request" above each endpoint

## Variables

- `@baseUrl` - API base URL (default: http://localhost:3000/api)
- `@authToken` - Bearer token for authentication
- `@loanId` - Loan ID for loan-specific endpoints
- `@notificationId` - Notification ID for notification endpoints

