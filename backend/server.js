const express = require('express');
const cors = require('cors');
const { startIndexer } = require('./indexer');
const { PrismaClient } = require('@prisma/client');

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

/**
 * Root route - API status and information
 */
app.get('/', (req, res) => {
  res.status(200).json({
    service: "Civitas Backend API",
    status: "ok",
    timestamp: new Date().toISOString(),
    description: "Blockchain-based welfare identity and delivery platform",
    endpoints: {
      benefits: "/benefits/:address",
      vendorTransactions: "/transactions/vendor/:address",
      users: "/api/users"
    }
  });
});

/**
 * Get all benefits for a beneficiary from the database.
 */
app.get('/benefits/:address', async (req, res) => {
  try {
    const beneficiary = req.params.address;
    const benefits = await prisma.benefit.findMany({
      where: { recipientAddress: beneficiary }
    });
    res.json(benefits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching benefits' });
  }
});

/**
 * Get all redemption transactions for a vendor from the database.
 */
app.get('/transactions/vendor/:address', async (req, res) => {
  try {
    const vendor = req.params.address;
    const txs = await prisma.benefit.findMany({
      where: { redeemedByAddress: vendor }
    });
    res.json(txs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching vendor transactions' });
  }
});

/**
 * Register or update a user profile linked to a wallet address.
 */
app.post('/api/users', async (req, res) => {
  try {
    const { walletAddress, role, name } = req.body;
    if (!walletAddress || !role) {
      return res.status(400).json({ error: 'walletAddress and role are required' });
    }
    const user = await prisma.user.upsert({
      where: { walletAddress },
      update: { role, name },
      create: { walletAddress, role, name }
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Start the event indexer to sync blockchain events into the database
if (require.main === module) {
  // Start indexer and server when run directly
  startIndexer();
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = { app, prisma };