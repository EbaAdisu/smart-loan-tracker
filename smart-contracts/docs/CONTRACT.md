# LoanTracker Contract

## What It Does
Tracks loans on blockchain. No real money - just numbers.

## Main Functions

### createLoan
```solidity
createLoan(address borrower, uint256 amount, string reason, uint256 dueDate)
```
Lender creates loan.

### recordPayment
```solidity
recordPayment(uint256 loanId, uint256 amount)
```
Borrower records payment. Auto-completes when fully paid.

### updateStatus
```solidity
updateStatus(uint256 loanId, LoanStatus newStatus)
```
Change status: Pending, Active, Completed, Overdue, Cancelled.

### getUserLoans
```solidity
getUserLoans(address user) → uint256[]
```
Get all loan IDs for user (lender or borrower).

### getLoanById
```solidity
getLoanById(uint256 loanId) → Loan
```
Get loan details.

### getPaymentHistory
```solidity
getPaymentHistory(uint256 loanId) → Payment[]
```
Get all payments for loan.

## Events
- `LoanCreated` - New loan
- `StatusUpdated` - Status changed
- `PaymentRecorded` - Payment made

## Mobile App Usage

```typescript
// Create loan
await contract.createLoan(borrower, amount, "Rent", dueDate);

// Record payment
await contract.recordPayment(loanId, amount);

// Get user loans
const loans = await contract.getUserLoans(userAddress);
```

**Done.**

