const { ethers } = require('ethers');
const { PrismaClient } = require('@prisma/client');
const { RPC_URL, CONTRACT_ADDRESS, ABI } = require('./constants');

const prisma = new PrismaClient();
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

async function handleBenefitIssued(benefitId, recipient, value, expiration, event) {
  try {
    const block = await provider.getBlock(event.blockNumber);
    const benefitOnChain = await contract.benefits(benefitId);
    await prisma.benefit.create({
      data: {
        benefitId: benefitId.toString(),
        recipientAddress: recipient,
        value: benefitOnChain.value.toString(),
        status: 'Issued',
        issuedAt: new Date(block.timestamp * 1000),
        expiresAt: new Date(benefitOnChain.expiration.toNumber() * 1000),
        issuedByAddress: benefitOnChain.issuingAuthority
      }
    });
    console.log(`Indexed BenefitIssued: ${benefitId}`);
  } catch (error) {
    console.error('Error indexing BenefitIssued', error);
  }
}

async function handleBenefitRedeemed(benefitId, recipient, vendor, event) {
  try {
    const block = await provider.getBlock(event.blockNumber);
    await prisma.benefit.update({
      where: { benefitId: benefitId.toString() },
      data: {
        status: 'Redeemed',
        redeemedAt: new Date(block.timestamp * 1000),
        redeemedByAddress: vendor
      }
    });
    console.log(`Indexed BenefitRedeemed: ${benefitId} by ${vendor}`);
  } catch (error) {
    console.error('Error indexing BenefitRedeemed', error);
  }
}

async function handleVendorRegistered(vendor, event) {
  try {
    await prisma.vendor.upsert({
      where: { walletAddress: vendor },
      update: { isVerified: true },
      create: { walletAddress: vendor, isVerified: true }
    });
    console.log(`Indexed VendorRegistered: ${vendor}`);
  } catch (error) {
    console.error('Error indexing VendorRegistered', error);
  }
}

async function handleVendorRemoved(vendor, event) {
  try {
    await prisma.vendor.update({
      where: { walletAddress: vendor },
      data: { isVerified: false }
    });
    console.log(`Indexed VendorRemoved: ${vendor}`);
  } catch (error) {
    console.error('Error indexing VendorRemoved', error);
  }
}

function startIndexer() {
  contract.on('BenefitIssued', handleBenefitIssued);
  contract.on('BenefitRedeemed', handleBenefitRedeemed);
  contract.on('VendorRegistered', handleVendorRegistered);
  contract.on('VendorRemoved', handleVendorRemoved);
  console.log('Event indexer started. Listening for contract events...');
}

module.exports = { startIndexer };