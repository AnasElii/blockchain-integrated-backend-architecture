const ethers = require('ethers');
const NFTMarketplace = require('../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json');
require('dotenv').config();

// Connect to the Sepolia network 
const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);

// // Get smart contract
const contract = new ethers.Contract(
    process.env.NFT_MARKETPLACECONTRACT_ADDRESS,
    NFTMarketplace.abi,
    provider
)

module.exports = {provider, contract};