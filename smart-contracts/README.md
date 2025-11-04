# Smart Loan Tracker - Smart Contracts

Simple loan tracking on Ethereum Sepolia testnet. No real money transfers - tracks loans only.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
Create `.env` file:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY
SEPOLIA_PRIVATE_KEY=your_testnet_wallet_private_key
```

### 3. Compile
```bash
npm run compile
```

### 4. Test
```bash
npm run test
```

### 5. Deploy

**Local testnet:**
```bash
npm run node          # Terminal 1
npm run deploy:local  # Terminal 2
```

**Sepolia testnet:**
```bash
npm run deploy:sepolia
```

## 📋 Contract Features

- ✅ Create loans (lender, borrower, amount, reason, due date)
- ✅ Update status (Pending, Active, Completed, Overdue, Cancelled)
- ✅ Record payments (borrower only)
- ✅ Auto-complete when fully paid
- ✅ Get loans by user
- ✅ Payment history tracking
- ✅ Events for frontend notifications

## 🔗 For Mobile App Integration

After deployment, you'll need:
1. **Contract Address** - from deployment output
2. **Contract ABI** - in `artifacts/contracts/LoanTracker.sol/LoanTracker.json`
3. **Network** - Sepolia (Chain ID: 11155111)

## 📁 Structure

```
smart-contracts/
├── contracts/
│   └── LoanTracker.sol       # Main contract
├── test/
│   └── LoanTracker.test.ts   # Tests
├── ignition/modules/
│   └── LoanTracker.ts        # Deployment
└── hardhat.config.ts         # Config
```

## 🔐 Important

- This is **testnet only** - free forever
- Contract **tracks numbers** - no real ETH transfers
- Keep your `.env` file **private**
- Use **testnet wallet** only

## 📖 Contract Functions

### createLoan
```solidity
createLoan(address borrower, uint256 amount, string reason, uint256 dueDate)
```

### recordPayment
```solidity
recordPayment(uint256 loanId, uint256 amount)
```

### updateStatus
```solidity
updateStatus(uint256 loanId, LoanStatus newStatus)
```

### getUserLoans
```solidity
getUserLoans(address user) returns (uint256[])
```

### getLoanById
```solidity
getLoanById(uint256 loanId) returns (Loan)
```

---

**Built for decentralized loan tracking mobile app**
