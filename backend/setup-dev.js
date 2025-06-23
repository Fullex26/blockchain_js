#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create .env file for local development
const envContent = `# Environment variables for local development
# Replace these with your actual values for production

# Ethereum Sepolia RPC URL (get from Infura or Alchemy)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# Deployed contract address (replace after deployment)
CONTRACT_ADDRESS=0x...deployed_contract_address_here

# Local SQLite database for development
DATABASE_URL="file:./dev.db"

# Server port
PORT=4000
`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file for local development');
  console.log('📝 Please update SEPOLIA_RPC_URL and CONTRACT_ADDRESS with your actual values');
} else {
  console.log('✅ .env file already exists');
}

console.log('\n🚀 Next steps:');
console.log('1. Update .env with your RPC URL and contract address');
console.log('2. Run: npm run prisma:migrate');
console.log('3. Run: npm start');