
const axios = require('axios');
const ethers = require('ethers');
const FormData = require('form-data');

const { provider, contract } = require('../config/ethersConfig');
const NFTMarketplace = require('../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json');

const mintNFT = async (req, res) => {
    try {

        const { name, description, price } = req.body;
        const image = req.file;

        // Validating the request
        if (!name || !description || !price || !image) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Form data for the IPFS request
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        // formData.append('file', image.buffer, image.originalname);
        formData.append('image', req.file.buffer, req.file.originalname);
        
        // Uploading the image to IPFS
        const ipfsResponse = await axios.post('http://localhost:4000/api/nftToIPFS', formData, {
            headers: formData.getHeaders()
        });
        
        const NFT_URI = `https://ipfs.io/ipfs/${ipfsResponse.data.ipfsHash}`;

        
        // Main wallet setup
        const mainWallet = new ethers.Wallet(process.env.SEPOLIA_MAIN_PRIVATE_KEY, provider);
        const balance = await provider.getBalance(mainWallet.address);
        const NFTPriceInWei = ethers.parseEther(price);
        
        // Checking the balance
        if (NFTPriceInWei >= balance) { 
            return res.status(400).json({ message: "Insufficient Funds" });
        }
        
        // Interacting with the contract
        const contractWithSigner = new ethers.Contract(
            process.env.NFT_MARKETPLACECONTRACT_ADDRESS,
            NFTMarketplace.abi,
            mainWallet
        )
        
        const listingPrice = await contractWithSigner.listingPrice();
        console.log("Price: ", price);
        console.log("Listing Price: ", ethers.formatEther(listingPrice.toString()));
        console.log("Balance: ", ethers.formatEther(balance.toString()));
        console.log("NFT Price in Wei: ", ethers.formatEther(NFTPriceInWei.toString()));

        // Minting the NFT
        let trans = await contractWithSigner.mintNFT(
            NFT_URI,
            NFTPriceInWei,
            { value: listingPrice }
        );

        await trans.wait();
        
        return res.json({ message: "NFT Minted Successfully" });

    } catch (error) {
        console.error("Error minting NFT: ", error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = mintNFT;