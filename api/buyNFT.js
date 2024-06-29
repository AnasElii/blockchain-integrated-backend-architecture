const ethers = require('ethers');
const FormData = require('form-data');
const axios = require('axios');
require('dotenv').config();

const NFTMarketplace = require('../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json');

const buyNFT = async (req, res) => {
    console.log("Buying NFT");
    try {
        
        return res.status(200).json({ message: "Transaction complete with success!" });

    } catch (error) {
        console.error("Error minting NFT: ", error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = buyNFT;
