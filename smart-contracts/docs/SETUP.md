# Setup & Deploy

## Install
```bash
npm install
```

## Test Locally
```bash
npm run compile
npm run test
```

## Deploy

### Local Network
```bash
npm run node          # Terminal 1
npm run deploy:local  # Terminal 2
```

### Sepolia Testnet

1. Create `.env`:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
SEPOLIA_PRIVATE_KEY=your_key
```

2. Get testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

3. Deploy:
```bash
npm run deploy:sepolia
```

## Output for Mobile App

After deployment, save:
- **Contract Address** (from deployment logs)
- **ABI** (in `artifacts/contracts/LoanTracker.sol/LoanTracker.json`)
- **Network**: Sepolia, Chain ID: 11155111

---

**That's it. Simple.**

