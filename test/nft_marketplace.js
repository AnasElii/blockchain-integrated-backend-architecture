const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

describe("NFT Marketplace", function () {
    async function initialize() {
        const [owner, user1, user2, user3] = await ethers.getSigners();

        const counters = await ethers.deployContract("Counters");
        const marketplaceFactory = await ethers.getContractFactory("NFTMarketplace", {
            libraries: {
                Counters: counters,
            },
        });

        const marketplace = await marketplaceFactory.deploy();
        await marketplace.waitForDeployment();

        const listingPrice = await marketplace.listingPrice();

        return { marketplace, owner, user1, user2, user3, listingPrice };
    }

    describe("Mint NFT", () => {
        it("Shold mint nft", async function () {
            const { marketplace, user1, listingPrice } = await loadFixture(initialize);

            //Mint a new NFT
            const _tokenURI = "Token URI";
            const price = 100000000;

            await marketplace.connect(user1).mintNFT(_tokenURI, price, { value: listingPrice });

            // Check if the NFT has been minted successfully
            const allNFTs = await marketplace.getAllNFTs();
            expect(allNFTs.length).to.equal(1);
            expect(allNFTs[0].owner).to.equal(user1.address);
        });
    });

    describe("Get All NFTs", () => {
        it("Shold return all NFTs", async () => {
            const { marketplace, user1, user2, user3, listingPrice } = await loadFixture(initialize);
            const accounts = [user1, user2, user3];
            //Mint a new NFT
            const _tokenURI = "Token URI";
            const price = 100000000;

            for (let i = 0; i < 3; i++)
                await marketplace.connect(accounts[i]).mintNFT(_tokenURI, price, { value: listingPrice });

            // Check if the NFT has been minted successfully
            const allNFTs = await marketplace.getAllNFTs();
            expect(allNFTs.length).to.equal(3);
        });
    });

    describe("Get All NFTs", () => {
        it("Shold return all NFTs", async () => {
            const { marketplace, user1, user2, user3, listingPrice } = await loadFixture(initialize);
            const accounts = [user1, user2, user3];
            const numbers = [3, 5, 1];
            //Mint a new NFT
            const _tokenURI = "Token URI";
            const price = 100000000;

            for (let i = 0; i < 3; i++)
                for (let j = 0; j < numbers[i]; j++)
                    await marketplace.connect(accounts[i]).mintNFT(_tokenURI, price, { value: listingPrice });

            // Check if the NFT has been minted successfully
            const allMyNfts = await marketplace.connect(user2).getMyNfts();
            expect(allMyNfts.length).to.equal(5);
            expect(allMyNfts[0].owner).to.equal(user2.address);
            expect(allMyNfts[1].owner).to.equal(user2.address);
            expect(allMyNfts[2].owner).to.equal(user2.address);
            expect(allMyNfts[3].owner).to.equal(user2.address);
            expect(allMyNfts[4].owner).to.equal(user2.address);
        });
    });

    describe("Buy an NFT", async ()=>{
        it("Shold return all NFTs", async () => {
            const { marketplace, user1, user2, user3, listingPrice } = await loadFixture(initialize);
            const accounts = [user1, user2, user3];
            const numbers = [3, 5, 0];

            //Mint a new NFT
            const _tokenURI = "Token URI";
            const price = 100000000;

            for (let i = 0; i < 3; i++)
                await marketplace.connect(user1).mintNFT(_tokenURI, (price*(1+i)), { value: listingPrice });

            // Buy NFT
            await marketplace.connect(user2).buyNFT(2, {value: 300000000});

            // Get The 2th Account NFTs
            const user2NFTs = await marketplace.connect(user2).getMyNfts();
            expect(user2NFTs.length).to.equal(1);

            // Get the 1th Account NFTs
            const user1NFTs = await marketplace.connect(user1).getMyNfts();
            expect(user1NFTs.length).to.equal(2);

        });
    });
});