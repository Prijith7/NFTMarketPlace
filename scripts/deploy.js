const { ethers, upgrades } = require('hardhat');

async function main() {
  // Deploy the NFTMarket contract
  const NFTMarket = await ethers.getContractFactory('NFTMarket');
  console.log('Deploying NFTMarket...');
  const nftMarket = await upgrades.deployProxy(NFTMarket, [], { initializer: 'initialize' });
  await nftMarket.deployed();
  console.log('NFTMarket deployed to:', nftMarket.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });