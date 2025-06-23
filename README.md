# Blockchain-Based Welfare Identity and Delivery Platform MVP

This repository contains the source code for a Minimum Viable Product (MVP) of a blockchain-based welfare delivery platform for Australia, demonstrating programmable welfare benefits, digital identity verification, and transparent auditing on the Ethereum Sepolia testnet.

## Project Structure

```
/  
├── contracts
│   ├── WelfareBenefit.sol          # Smart contract
│   ├── hardhat.config.js           # Hardhat configuration
│   ├── scripts
│   │   └── deploy.js               # Deployment script
│   ├── package.json                # Contracts package config
│   └── .env.example                # Example env for contract deployment
├── admin-portal                    # Next.js Admin Portal
├── beneficiary-portal              # Next.js Beneficiary Portal
├── vendor-portal                   # Next.js Vendor Portal
└── backend                         # Express.js backend API
    ├── constants.js
    ├── server.js
    ├── package.json
    └── .env.example
```

## Prerequisites

- Node.js (v16+)
- npm or yarn
- MetaMask browser extension
- Ethereum Sepolia testnet access
- PostgreSQL (v12+)

## Environment Variables Setup

You'll need to set up environment variables for each component. Here's what you need:

### For Smart Contracts (`contracts/.env`):
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_wallet_private_key_here
```

### For Backend (`backend/.env`):
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
CONTRACT_ADDRESS=0x...deployed_contract_address_here
DATABASE_URL=postgresql://username:password@localhost:5432/welfare_db
PORT=4000
```

### For All Frontend Portals (`.env.local`):
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...deployed_contract_address_here
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

**Getting RPC URL:**
1. Sign up at [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/)
2. Create a new project for Ethereum Sepolia testnet
3. Copy the HTTP URL

**Getting Sepolia ETH:**
Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com) for deployment and transactions.

**MetaMask Sepolia Setup:**
Add Sepolia testnet to MetaMask:
- Network Name: Sepolia Testnet
- RPC URL: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`
- Chain ID: 11155111
- Currency Symbol: SepoliaETH
- Block Explorer: https://sepolia.etherscan.io

## Smart Contract (Contracts)

1. Configure environment variables:
   ```bash
   cd contracts
   cp .env.example .env
   # Edit .env to set SEPOLIA_RPC_URL and PRIVATE_KEY
   ```
2. Install dependencies and compile:
   ```bash
   npm install
   npm run compile
   ```
3. Deploy to Sepolia:
   ```bash
   npm run deploy
   ```
4. Note the deployed contract address for frontends and backend.

## Web Portals (Next.js & Tailwind CSS)

### Admin Portal
```bash
cd admin-portal
cp .env.local.example .env.local
# Set NEXT_PUBLIC_CONTRACT_ADDRESS and NEXT_PUBLIC_SEPOLIA_RPC_URL
npm install
npm run dev
```
# To integrate Shadcn/UI (for enhanced components):
```bash
cd admin-portal
npx shadcn-ui@latest init
# Select components: Button, DataTable, Card, Toast, Spinner
```

### Beneficiary Portal
```bash
cd beneficiary-portal
cp .env.local.example .env.local
# Set NEXT_PUBLIC_CONTRACT_ADDRESS and NEXT_PUBLIC_SEPOLIA_RPC_URL
npm install
npm run dev
```
# Integrate Shadcn/UI for Cards:
```bash
cd beneficiary-portal
npx shadcn-ui@latest init
# Select components: Card, VCCard
```

### Vendor Portal
```bash
cd vendor-portal
cp .env.local.example .env.local
# Set NEXT_PUBLIC_CONTRACT_ADDRESS and NEXT_PUBLIC_SEPOLIA_RPC_URL
npm install
npm run dev
```
# Integrate Shadcn/UI for DataTable, Buttons, Toasts:
```bash
cd vendor-portal
npx shadcn-ui@latest init
# Select components: Button, DataTable, Toast, Spinner
```

## Backend API (Express.js)

```bash
cd backend
cp .env.example .env
# Set SEPOLIA_RPC_URL, CONTRACT_ADDRESS, and DATABASE_URL
npm install
# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev --name init
npm start
```

Available endpoints:

- `GET /benefits/:address` - List benefits for a beneficiary (from database).
- `GET /transactions/vendor/:address` - List redemption transactions for a vendor (from database).
- `POST /api/users` - Register or update a user profile linked to a wallet address.

## Next Steps

- Integrate real DID/VC issuance (e.g., Ceramic, Self.ID).
- Enhance security and input validation.
- Add automated tests and CI workflows.

## Testing & Quality Assurance

- **Smart Contract Tests**: `cd contracts && npm test` (Hardhat + Chai)
- **Backend Tests**: `cd backend && npm test` (Jest + Supertest)
- **Frontend E2E Tests**: `npx cypress open` (runs Admin, Beneficiary, Vendor flows)

## Pilot Guide

See [PILOT_GUIDE.md](./PILOT_GUIDE.md) for step-by-step instructions and screenshots for each role.

---

This MVP demonstrates the core flows: benefit issuance, DID/VC placeholder, and redemption by vendors with on-chain transparency.