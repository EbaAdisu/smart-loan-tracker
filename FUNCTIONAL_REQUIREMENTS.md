# Functional Requirements - Decentralized Loan Tracker

## Core Features

### 1. Loan Management
- Create loan entries with:
  - Amount
  - Reason/purpose
  - Borrower/Lender information
  - Date created
  - Due date
  - Status (pending, active, completed, overdue)
- Edit loan details
- Delete loans
- Mark loans as paid/received

### 2. Loan Tracking
- Track loan duration/time
- Record payment history
- Track remaining balance
- Calculate total loans given vs received

### 3. Notifications & Reminders
- Daily cron job updates:
  - Total number of active loans
  - Loans owed by user
  - Loans owed to user
  - Overdue loans
- Push notifications for:
  - Loan due dates approaching
  - Overdue loans
  - Loan status changes
  - Messages from other users

### 4. Analytics & Reporting
- Monthly view:
  - Total loans given/received
  - Net position (positive/negative)
  - Loan count
- Yearly view:
  - Annual summary
  - Trends over time
  - Category breakdown (by reason)
- Balance indicator:
  - Clear positive/negative status
  - Total outstanding amount

### 5. Messaging/Chat System
- Direct chat between users who owe each other
- Send messages to borrowers/lenders
- Receive messages from other users
- Chat available for users with active loan relationships
- In-app notifications for new messages
- Message history per loan/user
- Persistent chat threads linked to loan relationships

### 6. Loan Status Notifications
- Alert lender if loan not received
- Alert borrower if payment reminder needed
- Automated status updates

### 7. Platform Requirements
- Cross-platform support:
  - Android
  - iOS
- Decentralized architecture:
  - No central server dependency
  - Peer-to-peer data sync
  - Blockchain/Distributed ledger for loan records

### 8. User Management
- User authentication (wallet-based or decentralized identity)
- User profiles
- Contact/user discovery

