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
const mainSigner = new ethers.Wallet(process.env.SEPOLIA_MAIN_PRIVATE_KEY, provider);
const secondarySigner = new ethers.Wallet(process.env.SEPOLIA_SECONDARY_PRIVATE_KEY, provider);

// Interacting with the contract
const contractWithSigner = async (signer) => {

    const newSigner = new ethers.Wallet(signer, provider);

    return new ethers.Contract(
        process.env.NFT_MARKETPLACE_CONTRACT_ADDRESS,
        NFTMarketplace.abi,
        newSigner
    )
};

module.exports = { provider, mainSigner, secondarySigner, contractWithSigner, contractWithProvider };