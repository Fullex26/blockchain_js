const hre = require("hardhat");

async function main() {
  const WelfareBenefit = await hre.ethers.getContractFactory("WelfareBenefit");
  const welfare = await WelfareBenefit.deploy();
  await welfare.deployed();
  console.log("WelfareBenefit deployed to:", welfare.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});