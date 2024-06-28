const axios = require('axios');
const ethers = require('ethers');
const FormData = require('form-data');
require('dotenv').config();

const NFTMarketplace = require('../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json');
const { provider, mainSigner, contractWithSigner, contractWithProvider } = require('../config/ethersConfig');

const mintNFT = async (req, res) => {
    try {

        const { signer, balance, name, description, price } = req.body;
        const image = req.file;

        // Validating the request
        if (!name || !description || !price || !image) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        console.log("BE: Owner", signer);
        console.log("BE: Balance", balance);
        // const balance = await provider.getBalance(signer);
        // Convert the price to Wei
        // const balance = await provider.getBalance(owner);
        const NFTPriceInWei = ethers.parseEther(price);


        // Checking the balance
        if (NFTPriceInWei >= balance) {
            return res.status(400).json({ message: "Insufficient Funds" });
        }

        // Form data for the IPFS request
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', NFTPriceInWei.toString());
        formData.append('image', req.file.buffer, req.file.originalname);

        // Uploading the image to IPFS
        const ipfsResponse = await axios.post(`http://localhost:${process.env.PORT}/api/nftToIPFS`, formData, {
            headers: formData.getHeaders()
        });

        // Constructing the NFT URI
        const NFT_URI = `https://ipfs.io/ipfs/${ipfsResponse.data.IpfsHash}`;

        const listingPrice = await contractWithProvider.listingPrice();
        console.log("Listing Price:", listingPrice);

        const isValidAddress = ethers.isAddress(signer);
        if (!isValidAddress) {
            console.error("Invalid Ethereum address:", signer);
            return res.status(400).json({ message: "Invalid Ethereum address" });
        }

        const newSigner = await provider.getSigner(signer);
        const contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS,
            NFTMarketplace.abi,
            newSigner
        );
        
        // Minting the NFT
        let transaction = await contract.mintNFT(
            NFT_URI,
            NFTPriceInWei,
            { value: listingPrice }
        );
        
        await transaction.wait();
        
        if (transaction) {
            return res.status(200).json({ message: "NFT Minted Successfully" });
        }
    } catch (error) {
        console.error("Error minting NFT: ", error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = mintNFT;