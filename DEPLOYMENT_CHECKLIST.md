# 🚀 Civitas MVP Deployment & Testing Checklist

## ✅ Pre-Deployment Requirements

### 1. Get Sepolia Test ETH
- [ ] Visit https://sepoliafaucet.com
- [ ] Request ETH for address: `0x57283604008642706eA421Bdff7D822073808CCE`
- [ ] Wait 1-2 minutes for confirmation
- [ ] Verify balance: `cd contracts && npx hardhat run scripts/check-wallet.js --network sepolia`

### 2. Deploy Smart Contract
```bash
cd contracts
npm run deploy
```
- [ ] Contract deployed successfully
- [ ] **Save the contract address** (you'll need it for setup!)

## 🔧 Environment Setup

### 3. Configure All Services
```bash
# Run this with your deployed contract address
./setup-env.sh 0xYOUR_CONTRACT_ADDRESS_HERE
```
- [ ] Backend `.env` created
- [ ] Admin portal `.env.local` created  
- [ ] Beneficiary portal `.env.local` created
- [ ] Vendor portal `.env.local` created

### 4. Database Setup
```bash
# Install PostgreSQL (if not installed)
# macOS: brew install postgresql
# Start PostgreSQL service

# Create database
createdb welfare_db
```
- [ ] PostgreSQL installed and running
- [ ] Database `welfare_db` created

## 🎯 Start All Services

### 5. Backend API
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm start
```
- [ ] Backend running on http://localhost:4000
- [ ] Database migrations applied
- [ ] No errors in console

### 6. Frontend Portals (3 separate terminals)

**Admin Portal:**
```bash
cd admin-portal
npm install
npm run dev
```
- [ ] Admin portal running on http://localhost:3000

**Beneficiary Portal:**
```bash
cd beneficiary-portal  
npm install
npm run dev
```
- [ ] Beneficiary portal running on http://localhost:3001

**Vendor Portal:**
```bash
cd vendor-portal
npm install  
npm run dev
```
- [ ] Vendor portal running on http://localhost:3002

## 🧪 Manual Testing Workflows

### 7. MetaMask Setup
- [ ] MetaMask installed and configured for Sepolia
- [ ] Network: Sepolia Testnet (Chain ID: 11155111)
- [ ] Your wallet has test ETH
- [ ] Create 2 additional test accounts (for vendor & beneficiary)

### 8. Admin Workflow Testing

**Open: http://localhost:3000**

- [ ] Connect wallet (your main account)
- [ ] Register a vendor:
  - Enter vendor wallet address
  - Click "Add Vendor"
  - Verify transaction success
- [ ] Issue a benefit:
  - Recipient: beneficiary wallet address
  - Benefit Type: "TestBenefit" 
  - Value: 100
  - Expiration: future date
  - Click "Issue Benefit"
  - Verify transaction success
- [ ] Check benefits table shows new benefit

### 9. Beneficiary Workflow Testing

**Open: http://localhost:3001**

- [ ] Switch MetaMask to beneficiary account
- [ ] Connect wallet
- [ ] View mock Verifiable Credentials
- [ ] Verify benefit card appears with correct details
- [ ] Check benefit status shows "Issued"

### 10. Vendor Workflow Testing

**Open: http://localhost:3002**

- [ ] Switch MetaMask to vendor account  
- [ ] Connect wallet
- [ ] Verify "registered vendor" status (not error)
- [ ] Redeem benefit:
  - Beneficiary Address: beneficiary wallet
  - Benefit Type: "TestBenefit"
  - Click "Redeem"
  - Verify transaction success
- [ ] Check redemption appears in history table

### 11. End-to-End Verification

- [ ] Refresh beneficiary portal - benefit status shows "Redeemed"
- [ ] Check admin portal - benefits table shows "Redeemed" status
- [ ] Verify all transaction events on Sepolia Etherscan

## 🎉 Success Criteria

If all checkboxes are complete, your Civitas MVP is fully functional and ready for demonstration!

## 🆘 Troubleshooting

**Contract deployment fails:**
- Check wallet has Sepolia ETH
- Verify RPC URL is correct

**Frontend can't connect:**
- Ensure MetaMask is on Sepolia network
- Check contract address in `.env.local` files

**Backend errors:**
- Verify PostgreSQL is running
- Check database connection string
- Ensure contract address is correct

**Transaction failures:**
- Check wallet has sufficient ETH for gas
- Verify you're on the correct network
- Check contract address is valid

---

🚀 **Your blockchain welfare platform is ready for testing!** 