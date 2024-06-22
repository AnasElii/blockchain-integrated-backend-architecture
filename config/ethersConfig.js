const ethers = require('ethers');
const NFTMarketplace = require('../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json');
require('dotenv').config();

// Connect to the Sepolia network 
const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);

// Get smart contract
const contractWithProvider = new ethers.Contract(
    process.env.NFT_MARKETPLACE_CONTRACT_ADDRESS,
    NFTMarketplace.abi,
    provider
)

// Wallet setup
const signer = new ethers.Wallet(process.env.SEPOLIA_MAIN_PRIVATE_KEY, provider);

// Interacting with the contract
const contractWithSigner = new ethers.Contract(
    process.env.NFT_MARKETPLACE_CONTRACT_ADDRESS,
    NFTMarketplace.abi,
    signer
)

module.exports = {provider, signer, contractWithSigner, contractWithProvider};