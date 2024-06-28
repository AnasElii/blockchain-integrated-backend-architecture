const ethers = require('ethers');
const FormData = require('form-data');
const axios = require('axios');
require('dotenv').config();

const { provider, signer, secondarySigner, contractWithSigner } = require('../config/ethersConfig');
const NFTMarketplace = require('../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json');

const buyNFT = async (req, res) => {
    console.log("Buying NFT");
    try {

        const { price, id, owner } = req.body;

        if (!price || !id || !owner) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        
        const balance = await provider.getBalance(secondarySigner);
        const NFTPriceInWei = ethers.parseEther(price);

        // Checking the balance
        if (NFTPriceInWei >= balance) {
            return res.status(400).json({ message: "Insufficient Funds" });
        }
        
        // Check if the NFT is owned by the buyer
        if (owner.toLowerCase() === secondarySigner.address.toLowerCase()) {
            return res.status(400).json({ message: "You already own this NFT" });
        }
        
        const contractWithSecondarySigner = new ethers.Contract(
            process.env.NFT_MARKETPLACE_CONTRACT_ADDRESS,
            NFTMarketplace.abi,
            secondarySigner
        )        
        
        let transaction = await contractWithSecondarySigner.buyNFT(
            id,
            { value: NFTPriceInWei }
        )
        
        await transaction.wait();
        
        if (transaction) {
            return res.status(200).json({ message: "Transaction complete with success!" });
        }

    } catch (error) {
        console.error("Error minting NFT: ", error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = buyNFT;
