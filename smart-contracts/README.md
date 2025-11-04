# Smart Loan Tracker - Smart Contracts

Tracks loans on Sepolia testnet. No real ETH - just tracking.

## Quick Commands

```bash
npm install              # Install
npm run compile         # Compile contract
npm run test           # Run tests (6 tests)
npm run deploy:sepolia # Deploy to testnet
```

## Deploy Locally

**Terminal 1 - Start node:**
```bash
npm run node
```

**Terminal 2 - Deploy:**
```bash
npm run deploy:local
```

**You'll get:**
```
✅ LoanTracker deployed to: 0x5fbdb2315678afecb367f032d93f642f64180aa3
```

## Deploy to Sepolia (Later)

1. Create `.env`:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
SEPOLIA_PRIVATE_KEY=your_key
```

2. Deploy:
```bash
npm run deploy:sepolia
```

## For Mobile App

See `MOBILE_APP_INTEGRATION.md` - use the contract address from deployment

---

**Contract tested ✅ | 6/6 tests passing**
