#!/bin/bash

# Setup script for Civitas MVP environment files
echo "🚀 CIVITAS MVP ENVIRONMENT SETUP"
echo "=================================="

# Check if contract address is provided
if [ -z "$1" ]; then
    echo "❌ Usage: ./setup-env.sh <CONTRACT_ADDRESS>"
    echo "Example: ./setup-env.sh 0x1234567890123456789012345678901234567890"
    exit 1
fi

CONTRACT_ADDRESS=$1
SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/zjFdyCAuFE3DPniVj9BkF"

echo "📍 Contract Address: $CONTRACT_ADDRESS"
echo "🌐 Sepolia RPC URL: $SEPOLIA_RPC_URL"
echo ""

# Backend .env
echo "📝 Creating backend/.env..."
cat > backend/.env << EOF
# Ethereum Sepolia testnet RPC URL
SEPOLIA_RPC_URL=$SEPOLIA_RPC_URL

# Smart contract address
CONTRACT_ADDRESS=$CONTRACT_ADDRESS

# PostgreSQL database connection string
DATABASE_URL=postgresql://postgres:password@localhost:5432/welfare_db

# Server port
PORT=4000
EOF

# Admin Portal .env.local
echo "📝 Creating admin-portal/.env.local..."
cat > admin-portal/.env.local << EOF
# Smart contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ADDRESS

# Ethereum Sepolia testnet RPC URL  
NEXT_PUBLIC_SEPOLIA_RPC_URL=$SEPOLIA_RPC_URL
EOF

# Beneficiary Portal .env.local
echo "📝 Creating beneficiary-portal/.env.local..."
cat > beneficiary-portal/.env.local << EOF
# Smart contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ADDRESS

# Ethereum Sepolia testnet RPC URL
NEXT_PUBLIC_SEPOLIA_RPC_URL=$SEPOLIA_RPC_URL
EOF

# Vendor Portal .env.local
echo "📝 Creating vendor-portal/.env.local..."
cat > vendor-portal/.env.local << EOF
# Smart contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ADDRESS

# Ethereum Sepolia testnet RPC URL
NEXT_PUBLIC_SEPOLIA_RPC_URL=$SEPOLIA_RPC_URL
EOF

echo ""
echo "✅ Environment files created successfully!"
echo ""
echo "🔄 NEXT STEPS:"
echo "1. Set up PostgreSQL database:"
echo "   createdb welfare_db"
echo ""
echo "2. Start backend:"
echo "   cd backend && npm install && npx prisma generate && npx prisma migrate dev --name init && npm start"
echo ""
echo "3. Start frontend portals (in separate terminals):"
echo "   cd admin-portal && npm install && npm run dev"
echo "   cd beneficiary-portal && npm install && npm run dev" 
echo "   cd vendor-portal && npm install && npm run dev"
echo ""
echo "🎯 Your MVP will be ready for testing!" 