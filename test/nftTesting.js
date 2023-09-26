const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function () {
  let NFTMarket;
  let nftMarket;
  let owner;
  let buyer;
  let seller;
  let nftContract;
  let tokenId;
  let listingPrice;

  beforeEach(async function () {
    [owner, buyer, seller] = await ethers.getSigners();

    // Deploy NFTMarket and NFT contract
    NFTMarket = await ethers.getContractFactory("NFTMarket");
    nftMarket = await NFTMarket.deploy();
    await nftMarket.deployed();

    const NFT = await ethers.getContractFactory("NFT");
    nftContract = await ERC721Mock.deploy("Market NFT", "MNFT");
    await nftContract.deployed();

    // Mint a token and approve it for sale
    await nftContract.mint(seller.address, 1);
    tokenId = 1;
    listingPrice = ethers.utils.parseEther("0.025");
    await nftContract.approve(nftMarket.address, tokenId);

    // Create a market item
    await nftMarket.createMarketItem(nftContract.address, tokenId, listingPrice);
  });

  it("Should create a market item", async function () {
    const marketItem = await nftMarket.fetchMarketItems();
    expect(marketItem.length).to.equal(1);
    expect(marketItem[0].seller).to.equal(seller.address);
    expect(marketItem[0].owner).to.equal("0x0000000000000000000000000000000000000000");
    expect(marketItem[0].price).to.equal(listingPrice);
    expect(marketItem[0].sold).to.equal(false);
  });

  it("Should allow a user to buy a market item", async function () {
    // Connect to the buyer's wallet
    const buyerMarket = nftMarket.connect(buyer);

    // Ensure the buyer has enough balance to buy
    await buyer.sendTransaction({
      to: buyer.address,
      value: listingPrice,
    });

    // Purchase the market item
    await buyerMarket.createMrketSale(nftContract.address, 1);

    const marketItem = await nftMarket.fetchMarketItems();
    expect(marketItem.length).to.equal(0);

    const buyerNFTs = await nftMarket.fetchMyNFTs();
    expect(buyerNFTs.length).to.equal(1);
    expect(buyerNFTs[0].owner).to.equal(buyer.address);
  });

  it("Should allow the owner to withdraw listing fees", async function () {
    // Connect to the owner's wallet
    const ownerMarket = nftMarket.connect(owner);

    const initialBalance = await owner.getBalance();
    await ownerMarket.withdrawListingFees();

    const finalBalance = await owner.getBalance();

    expect(finalBalance.gt(initialBalance)).to.equal(true);
  });
});