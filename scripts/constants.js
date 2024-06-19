const { ethers } = require("hardhat");
require('dotenv').config();

async function getInitializedContract() {
    
    const Counters = await ethers.getContractFactory("Counters");
    const counters = await Counters.attach(process.env.COUNTERS_CONTRACT_ADDRESS);
    
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace", {
        libraries:
        {
            Counters: counters,
        }
    });
    const marketplace = await NFTMarketplace.attach(process.env.NFT_MARKETPLACECONTRACT_ADDRESS);
    
    const listingPrice = await marketplace.listingPrice();
    const accounts = await ethers.getSigners();

    return { marketplace, accounts, listingPrice };
}

const NFTDetails= {
    URI: "URI",
    price: 6
}

module.exports = { getInitializedContract, NFTDetails }