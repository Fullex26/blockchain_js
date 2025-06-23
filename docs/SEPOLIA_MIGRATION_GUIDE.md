# Migration Guide: Polygon Mumbai to Ethereum Sepolia

This guide helps you migrate your existing Civitas platform setup from Polygon Mumbai to Ethereum Sepolia testnet.

## Why Migrate?

Ethereum Sepolia is the primary, long-term supported testnet for Ethereum application development. This migration ensures:
- Better long-term support and reliability
- Alignment with Ethereum ecosystem standards
- More stable testing environment

## Migration Steps

### 1. Update Smart Contract Configuration

Update your `contracts/hardhat.config.js`:
```javascript
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111
    }
  }
};
```

### 2. Create Environment Files

Create these environment files with your specific values:

#### `contracts/.env`
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_wallet_private_key_here
```

#### `backend/.env`
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
CONTRACT_ADDRESS=0x...deployed_contract_address_here
DATABASE_URL=postgresql://username:password@localhost:5432/welfare_db
PORT=4000
```

#### `admin-portal/.env.local`
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...deployed_contract_address_here
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

#### `beneficiary-portal/.env.local`
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...deployed_contract_address_here
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

#### `vendor-portal/.env.local`
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...deployed_contract_address_here
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

### 3. Get Sepolia RPC URL

1. Sign up at [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/)
2. Create a new project
3. Select "Ethereum" → "Sepolia" testnet
4. Copy the HTTP URL (looks like `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`)

### 4. Update MetaMask

Add Sepolia testnet to MetaMask:
- **Network Name:** Sepolia Testnet
- **RPC URL:** `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`
- **Chain ID:** 11155111
- **Currency Symbol:** SepoliaETH
- **Block Explorer:** https://sepolia.etherscan.io

### 5. Get Test ETH

Get Sepolia ETH from these faucets:
- [Sepolia Faucet](https://sepoliafaucet.com)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet)

### 6. Deploy Contracts

```bash
cd contracts
npm run compile
npm run deploy
```

Save the deployed contract address - you'll need it for all environment files!

### 7. Update All Environment Files

Replace `0x...deployed_contract_address_here` in all `.env` and `.env.local` files with your actual deployed contract address.

### 8. Start Services

```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm start

# Admin Portal
cd admin-portal
npm install
npm run dev

# Beneficiary Portal
cd beneficiary-portal
npm install
npm run dev

# Vendor Portal
cd vendor-portal
npm install
npm run dev
```

## Key Differences from Mumbai

| Aspect | Mumbai (Old) | Sepolia (New) |
|--------|-------------|---------------|
| Network | Polygon Mumbai | Ethereum Sepolia |
| Chain ID | 80001 | 11155111 |
| Currency | MATIC | SepoliaETH |
| RPC Variable | `MUMBAI_RPC_URL` | `SEPOLIA_RPC_URL` |
| Frontend RPC | `NEXT_PUBLIC_RPC_URL` | `NEXT_PUBLIC_SEPOLIA_RPC_URL` |
| Deploy Command | `--network mumbai` | `--network sepolia` |

## Troubleshooting

**Contract deployment fails:**
- Check you have Sepolia ETH in your wallet
- Verify RPC URL is correct and has credits
- Ensure private key is valid

**Frontend can't connect:**
- Verify MetaMask is on Sepolia network
- Check contract address is correct in `.env.local`
- Ensure RPC URL environment variable is set

**Backend indexer not working:**
- Verify contract address matches deployed contract
- Check RPC URL has sufficient credits
- Ensure database is running and accessible

## Migration Complete!

Your Civitas platform is now running on Ethereum Sepolia testnet. All functionality remains the same, but you're now using the more stable and future-proof Ethereum testnet infrastructure. 