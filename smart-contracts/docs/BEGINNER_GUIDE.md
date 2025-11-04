# Beginner's Guide - Understanding the Code

## 🤔 Why TypeScript (.ts) Files?

**Short Answer:** TypeScript files help us **deploy, test, and interact** with Solidity contracts.

**Think of it like:**
- **Solidity (.sol)** = The actual smart contract (lives on blockchain)
- **TypeScript (.ts)** = Tools to work with the contract (run on your computer)

---

## 📁 File Purposes

### `LoanTracker.sol` (Solidity)
**What:** The actual smart contract  
**Where:** Gets deployed to blockchain  
**Does:** Stores and manages loan data

### `LoanTracker.test.ts` (TypeScript)
**What:** Tests for the contract  
**Where:** Runs on your computer  
**Does:** Makes sure contract works correctly before deploying

### `LoanTracker.ts` (in ignition/modules/)
**What:** Deployment script  
**Where:** Runs on your computer  
**Does:** Uploads contract to blockchain

---

## 📖 Explaining the Solidity Contract (Simple)

### 1. **Enums** (Line 11-17)
```solidity
enum LoanStatus {
    Pending, Active, Completed, Overdue, Cancelled
}
```
**Like:** A dropdown menu with fixed options  
**Why:** Loan can only be in one of these 5 states

---

### 2. **Structs** (Line 20-30)
```solidity
struct Loan {
    uint256 id;
    address lender;
    address borrower;
    uint256 amount;
    // ... more fields
}
```
**Like:** A form template with blank fields  
**Why:** Every loan needs the same information stored

**Fields explained:**
- `uint256 id` = Loan number (0, 1, 2, 3...)
- `address lender` = Wallet address of person who lent money
- `address borrower` = Wallet address of person who borrowed
- `uint256 amount` = How much money (in wei - smallest ETH unit)
- `string reason` = Why loan was taken ("Rent", "Medical", etc.)
- `uint256 dateCreated` = When loan was created (timestamp)
- `uint256 dueDate` = When loan should be paid back (timestamp)
- `LoanStatus status` = Current state (Pending/Active/etc.)
- `uint256 balanceRemaining` = How much still owed

---

### 3. **State Variables** (Line 37-40)
```solidity
uint256 public nextLoanId;
mapping(uint256 => Loan) public loans;
mapping(uint256 => Payment[]) public loanPayments;
mapping(address => uint256[]) private userLoans;
```

**Think of these as databases:**

**`nextLoanId`**  
- Like a counter: 0, 1, 2, 3...
- Each new loan gets next number

**`loans`**  
- Like a filing cabinet
- Give loan ID (key), get loan details (value)
- Example: loans[0] = first loan's details

**`loanPayments`**  
- Stores payment history for each loan
- Example: loanPayments[0] = [payment1, payment2, payment3]

**`userLoans`**  
- Stores which loans belong to each user
- Give wallet address, get list of loan IDs
- Example: userLoans[0x123...] = [0, 2, 5] (loan IDs)

---

### 4. **Events** (Line 43-63)
```solidity
event LoanCreated(...);
event StatusUpdated(...);
event PaymentRecorded(...);
```

**Like:** Notifications  
**Why:** Mobile app can listen and show alerts  
**Example:** "New loan created!" notification in your app

---

### 5. **Modifiers** (Line 66-77)
```solidity
modifier loanExists(uint256 _loanId) {
    require(_loanId < nextLoanId, "Loan does not exist");
    _;
}
```

**Like:** Security checks before running function  
**Why:** Prevents errors  
**Example:** Can't view loan #10 if only 5 loans exist

---

### 6. **Main Functions**

#### **createLoan** (Line 88-125)
```solidity
function createLoan(
    address _borrower,
    uint256 _amount,
    string memory _reason,
    uint256 _dueDate
) external returns (uint256)
```

**What it does step-by-step:**
1. **Check inputs are valid** (Lines 96-100)
   - Borrower address exists
   - Can't lend to yourself
   - Amount > 0
   - Due date is in future

2. **Create new loan** (Lines 104-115)
   - Fill in all loan details
   - Set status to "Pending"
   - Set balance = amount

3. **Add to user lists** (Lines 117-118)
   - Add loan ID to lender's list
   - Add loan ID to borrower's list

4. **Increment counter** (Line 120)
   - nextLoanId goes from 0→1, 1→2, etc.

5. **Send notification** (Line 122)
   - Emit LoanCreated event

6. **Return loan ID** (Line 124)
   - So you know which loan was created

---

#### **recordPayment** (Line 148-184)
```solidity
function recordPayment(uint256 _loanId, uint256 _amount) external
```

**What it does:**
1. **Security checks:**
   - Only borrower can pay
   - Payment amount > 0
   - Loan isn't already paid
   - Payment ≤ remaining balance

2. **Update balance:**
   - Subtract payment from balance
   - Example: Had $100, paid $30, now $70 remaining

3. **Record payment:**
   - Add to payment history
   - Store amount and timestamp

4. **Auto-complete:**
   - If balance reaches 0, mark loan "Completed"

5. **Send notification:**
   - Emit PaymentRecorded event

---

#### **getUserLoans** (Line 206-211)
```solidity
function getUserLoans(address _user) external view returns (uint256[] memory)
```

**Simple:**
- Give wallet address
- Get array of loan IDs
- Example: [0, 2, 5] means you have loans #0, #2, #5

**`view`** = Just reading data, not changing anything (free, no gas)

---

## 🔧 TypeScript Files Explained

### `LoanTracker.test.ts`

**Purpose:** Test the contract before deploying

**Example test:**
```typescript
it("Should create a loan successfully", async function () {
  // 1. Deploy contract
  const { loanTracker, lender, borrower } = await loadFixture(deployLoanTrackerFixture);

  // 2. Create loan
  await loanTracker.write.createLoan([borrower.account.address, amount, "Rent", dueDate]);

  // 3. Check it worked
  const loan = await loanTracker.read.getLoanById([0n]);
  expect(loan.amount).to.equal(amount); // ✅ Pass if correct
});
```

**Like:** Quality control before shipping a product

---

### `ignition/modules/LoanTracker.ts`

**Purpose:** Deploy contract to blockchain

```typescript
const LoanTrackerModule = buildModule("LoanTrackerModule", (m) => {
  const loanTracker = m.contract("LoanTracker");
  return { loanTracker };
});
```

**Translation:**
1. Find contract named "LoanTracker"
2. Deploy it to blockchain
3. Return deployed contract

**Like:** Uploading your app to the App Store

---

## 🎯 Summary

**Solidity (.sol)**
- The smart contract
- Lives on blockchain forever
- Stores loan data
- Users interact with it from mobile app

**TypeScript (.ts)**
- Helper tools
- Run on your computer
- Test contract (make sure it works)
- Deploy contract (upload to blockchain)

**Flow:**
1. Write Solidity contract ✍️
2. Test with TypeScript 🧪
3. Deploy with TypeScript 🚀
4. Mobile app connects to deployed contract 📱

---

## 💡 Beginner Tips

### When testing:
```bash
npm run test  # Runs all .test.ts files
```

### When deploying:
```bash
npm run deploy:sepolia  # Runs ignition/modules/LoanTracker.ts
```

### The mobile app will:
```typescript
// Connect to your deployed contract
const contract = getContract(CONTRACT_ADDRESS, ABI);

// Call functions
await contract.createLoan(borrower, amount, reason, dueDate);
await contract.recordPayment(loanId, amount);
```

---

**Questions?** Ask anything! 🙋‍♂️

