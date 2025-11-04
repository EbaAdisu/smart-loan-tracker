# 🏗️ Decentralized Loan Tracker - Architecture & Action Plan
**Updated with Mandatory Name/Email + Wallet Recovery**

## 🎯 Overview
A decentralized mobile application built with **React Native (Expo)** and **Solidity Smart Contracts** to track, manage, and analyze peer-to-peer loans.  
Users must create an **account with name + email**, linked to a wallet for identity and **cross-device sync**.

---

## ⚙️ Tech Stack

### Frontend (Mobile App)
- **Framework:** React Native (Expo)
- **State Management:** Redux Toolkit or Zustand
- **Blockchain Integration:** ethers.js or viem
- **Wallet Connection / Creation:** In-App Wallet (ethers.js)
- **UI Library:** Native Base / React Native Paper
- **Notifications:** Expo Notifications API
- **Local Storage:** expo-secure-store for private key
- **Profile Storage:** Firebase Firestore or MongoDB Atlas (free tier)

### Smart Contracts (Decentralized Backend)
- **Language:** Solidity
- **Framework:** Hardhat
- **Network:** Ethereum Sepolia Testnet (free)
- **Data Storage:** On-chain loan metadata (IDs, wallet addresses, statuses)
- **Events:** Emit events for frontend notifications

### Optional Backend (Off-chain Features)
- **Runtime:** Node.js + Express/NestJS
- **Purpose:**  
  - Notifications & reminders  
  - Analytics aggregation  
  - Profile metadata storage (name + email + wallet link)  
- **Database:** Firestore / MongoDB Atlas
- **Hosting:** Free tiers (Render / Railway / Vercel)

---

## 🧩 System Structure

### 1. React Native App (Frontend Layer)
Responsible for:
- Creating/importing wallet  
- Collecting **mandatory name + email**  
- Checking **1:1 email → wallet mapping**  
- Storing private key securely (`expo-secure-store`)  
- Syncing profile metadata with Firestore/MongoDB  
- Displaying loan data and user-friendly names  
- Signing transactions to smart contract  
- Allowing wallet recovery on new devices via email + mnemonic  

### 2. Smart Contract Layer (Blockchain Core)
Responsible for:
- Storing loan entries tied to wallet addresses  
- Managing loan status updates and payments  
- Emitting events (`LoanCreated`, `LoanPaid`)  

### 3. Off-Chain Identity Layer
Responsible for:
- Mapping **wallet → name + email**  
- Ensuring **1:1 email-to-wallet** relationship  
- Providing APIs for profile lookup and cross-device recovery  
- Syncing user identity across devices  

### 4. Blockchain Network
- Ethereum Sepolia Testnet (free)  
- Stores immutable loan data

---

## 🔄 Data Flow

1. User opens app → must **enter name + email** → wallet created locally  
2. Check DB: if email exists → fetch linked wallet, else create new wallet  
3. Store wallet **securely locally** + metadata in DB  
4. User creates loan → smart contract stores lender + borrower addresses  
5. Frontend resolves wallet → shows **user-friendly names**  
6. Other users can search/identify friends by **name/email**  
7. User changes device → logs in with email → app restores wallet automatically or via mnemonic  

---

## 🧱 Component Mapping to Functional Requirements

| Functional Requirement | Implementation Layer | Description |
|-------------------------|----------------------|--------------|
| Loan Management | Solidity + RN UI | On-chain loan creation, editing, deletion |
| Loan Tracking | Solidity + RN | Balance tracking, duration, total given/received |
| Notifications & Reminders | Optional Backend + Expo | Notify user about due loans, status changes |
| Analytics & Reporting | Optional Backend + RN | Monthly/yearly trends, net position |
| Messaging / Chat System | Optional Backend | Peer-to-peer messaging linked to wallet |
| Loan Status Notifications | Smart Contract Events + Backend | Automated alerts based on events |
| Cross-Platform Support | Expo | Android + iOS |
| Decentralized Architecture | Solidity + Sepolia Testnet | P2P loan storage and transparency |
| User Management | Wallet + Mandatory Name & Email | Profile info stored off-chain, **1:1 email → wallet**, wallet is identity |

---

## 🔐 Security & Sync Notes
- **Private keys never leave device**  
- **Mnemonic phrase backup** for wallet recovery (mandatory on first signup)  
- **Email is only for profile retrieval and cross-device sync**  
- **One email → one wallet** ensures identity consistency  
- Off-chain DB stores **encrypted metadata only**  

---

## 🚀 Development Phases

### Phase 1: Blockchain Core
- Setup Hardhat + Solidity  
- Deploy loan smart contract on Sepolia testnet  

### Phase 2: Mobile Frontend
- Initialize Expo project  
- Implement wallet creation + **mandatory name/email collection**  
- Ensure **1:1 email → wallet mapping**  
- Securely store wallet locally  
- Sync metadata with Firestore/MongoDB  

### Phase 3: Frontend Smart Contract Integration
- Connect RN app → smart contract via ethers.js  
- Implement loan creation, update, and view using wallet addresses  

### Phase 4: Notifications & Analytics (Optional)
- Listen to contract events  
- Push notifications via Expo  
- Aggregate analytics off-chain  

### Phase 5: Messaging System (Optional)
- Connect wallet addresses to peer messaging  
- Store chat off-chain, linked to wallet  

### Phase 6: Testing & Deployment
- Test full workflow with multiple devices  
- Deploy fully on testnet  

---

## ✅ Summary
- **Wallet = Blockchain Identity**  
- **Name + Email = Mandatory User Identity**  
- **1:1 mapping ensures cross-device recovery**  
- **All loan data on-chain; metadata off-chain for UX**  
- **Free testnet + optional backend for analytics/notifications**
