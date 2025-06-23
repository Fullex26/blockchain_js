const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const address = signer.address;
  const balance = await signer.getBalance();
  
  console.log("=== WALLET INFO ===");
  console.log("Address:", address);
  console.log("Balance:", hre.ethers.utils.formatEther(balance), "SepoliaETH");
  console.log("===================");
  
  if (balance.eq(0)) {
    console.log("\n🚨 NO FUNDS DETECTED!");
    console.log("You need Sepolia ETH to deploy contracts.");
    console.log("\n📍 Get test ETH from these faucets:");
    console.log("1. https://sepoliafaucet.com");
    console.log("2. https://www.alchemy.com/faucets/ethereum-sepolia");
    console.log("3. https://faucet.quicknode.com/ethereum/sepolia");
    console.log("\n💡 Copy your address above and paste it into any faucet!");
  } else {
    console.log("✅ Wallet has funds - ready for deployment!");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 