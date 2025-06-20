require('dotenv').config();

module.exports = {
  RPC_URL: process.env.RPC_URL,
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  ABI: [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
      "name": "benefits",
      "outputs": [
        { "internalType": "address", "name": "recipient", "type": "address" },
        { "internalType": "uint256", "name": "value", "type": "uint256" },
        { "internalType": "uint256", "name": "expiration", "type": "uint256" },
        { "internalType": "address", "name": "issuingAuthority", "type": "address" },
        { "internalType": "uint8", "name": "status", "type": "uint8" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "vendors",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "recipient", "type": "address" },
        { "internalType": "bytes32", "name": "benefitId", "type": "bytes32" },
        { "internalType": "uint256", "name": "value", "type": "uint256" },
        { "internalType": "uint256", "name": "expiration", "type": "uint256" }
      ],
      "name": "issueBenefit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "vendor", "type": "address" }],
      "name": "addVendor",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "vendor", "type": "address" }],
      "name": "removeVendor",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "bytes32", "name": "benefitId", "type": "bytes32" },
        { "internalType": "address", "name": "recipient", "type": "address" }
      ],
      "name": "redeemBenefit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "bytes32", "name": "benefitId", "type": "bytes32" }],
      "name": "checkAndExpire",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "bytes32", "name": "benefitId", "type": "bytes32" },
        { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" },
        { "indexed": false, "internalType": "uint256", "name": "expiration", "type": "uint256" }
      ],
      "name": "BenefitIssued",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "bytes32", "name": "benefitId", "type": "bytes32" },
        { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" },
        { "indexed": true, "internalType": "address", "name": "vendor", "type": "address" }
      ],
      "name": "BenefitRedeemed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "vendor", "type": "address" }],
      "name": "VendorRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "vendor", "type": "address" }],
      "name": "VendorRemoved",
      "type": "event"
    }
  ]
};