
const hre = require("hardhat");
const {Web3DevsNFTContractAddress} = require('../constants/index');

async function main() {

  const Web3DevsToken = await hre.ethers.getContractFactory("Web3DevsToken");
  const Web3DevsTokenConract = await Web3DevsToken.deploy(Web3DevsNFTContractAddress);

  await Web3DevsTokenConract.deployed();

  console.log("Web3DevsToken Smart Conract deployed to:", Web3DevsTokenConract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
