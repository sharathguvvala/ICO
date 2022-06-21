
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

// smart contract address 0x559Ac5bD0B05C8679f48F933984D01B009904eE7