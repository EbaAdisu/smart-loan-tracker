# 📱 Mobile App Integration Guide

## Deploy Contract First

```bash
cd smart-contracts
npm run deploy:sepolia
```

**Save these 2 things:**
1. **Contract Address** - from deployment output
2. **ABI** - in `artifacts/contracts/LoanTracker.sol/LoanTracker.json`

---

## React Native Setup

### 1. Install viem in your mobile app
```bash
npm install viem
```

### 2. Connect to Contract

```typescript
import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Contract details (from deployment)
const CONTRACT_ADDRESS = "0x..."; // Your deployed address
const CONTRACT_ABI = [...]; // Copy from artifacts/contracts/LoanTracker.sol/LoanTracker.json

// Setup clients
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http('https://sepolia.infura.io/v3/YOUR_INFURA_KEY')
});

const account = privateKeyToAccount('0x...'); // User's wallet
const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http('https://sepolia.infura.io/v3/YOUR_INFURA_KEY')
});
```

### 3. Call Contract Functions

**Create Loan:**
```typescript
const createLoan = async (borrower, amount, reason, dueDate) => {
  const hash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'createLoan',
    args: [borrower, parseEther(amount), reason, BigInt(dueDate)]
  });
  
  await publicClient.waitForTransactionReceipt({ hash });
};
```

**Record Payment:**
```typescript
const recordPayment = async (loanId, amount) => {
  const hash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'recordPayment',
    args: [BigInt(loanId), parseEther(amount)]
  });
  
  await publicClient.waitForTransactionReceipt({ hash });
};
```

**Get User's Loans:**
```typescript
const getUserLoans = async (userAddress) => {
  const loanIds = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getUserLoans',
    args: [userAddress]
  });
  
  return loanIds;
};
```

**Get Loan Details:**
```typescript
const getLoan = async (loanId) => {
  const loan = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getLoanById',
    args: [BigInt(loanId)]
  });
  
  return {
    id: loan.id,
    lender: loan.lender,
    borrower: loan.borrower,
    amount: formatEther(loan.amount),
    reason: loan.reason,
    status: loan.status, // 0=Pending, 1=Active, 2=Completed, 3=Overdue, 4=Cancelled
    balance: formatEther(loan.balanceRemaining)
  };
};
```

**Listen to Events:**
```typescript
// Listen for new loans
publicClient.watchContractEvent({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  eventName: 'LoanCreated',
  onLogs: (logs) => {
    logs.forEach((log) => {
      console.log('New loan:', log.args);
      // Show notification
    });
  }
});
```

---

## Contract Functions

| Function | Who Can Call | What It Does |
|----------|-------------|--------------|
| `createLoan` | Anyone | Create new loan (caller = lender) |
| `updateStatus` | Lender or Borrower | Change loan status |
| `recordPayment` | Borrower | Record payment, auto-completes when paid |
| `getLoanById` | Anyone | Get loan details |
| `getUserLoans` | Anyone | Get loan IDs for user |
| `getPaymentHistory` | Anyone | Get payment history |

## Loan Status
- `0` = Pending
- `1` = Active
- `2` = Completed
- `3` = Overdue
- `4` = Cancelled

---

## Network Info
- **Chain:** Sepolia Testnet
- **Chain ID:** 11155111
- **RPC:** `https://sepolia.infura.io/v3/YOUR_KEY`
- **Explorer:** https://sepolia.etherscan.io

---

**That's it! Simple and clean.** 🚀

