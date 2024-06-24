const axios = require('axios');
const ethers = require('ethers');
const FormData = require('form-data');
require('dotenv').config();

const eventEmitter = require('../event/eventEmitter');
const { provider, signer, contractWithSigner } = require('../config/ethersConfig');

const mintNFT = async (req, res) => {
    try {

        const { name, description, price } = req.body;
        const image = req.file;

        // Validating the request
        if (!name || !description || !price || !image) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Convert the price to Wei
        const balance = await provider.getBalance(signer.address);
        const NFTPriceInWei = ethers.parseEther(price);

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

        // Checking the balance
        if (NFTPriceInWei >= balance) {
            return res.status(400).json({ message: "Insufficient Funds" });
        }

        const listingPrice = await contractWithSigner.listingPrice();

        // Minting the NFT
        let trans = await contractWithSigner.mintNFT(
            NFT_URI,
            NFTPriceInWei,
            { value: listingPrice }
        );

        await trans.wait();
        console.log("NFT Hash", trans.hash)

        return res.json({ message: "NFT Minted Successfully" });

    } catch (error) {
        console.error("Error minting NFT: ", error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = mintNFT;