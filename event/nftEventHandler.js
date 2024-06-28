const ethers = require('ethers');
const axios = require('axios');

const nftModel = require('../models/nftModel');
const { contractWithProvider } = require('../config/ethersConfig');

const nftEventHandler = async () => {

    contractWithProvider.on("NFTListed", async (id, contractAddress, owner, price) => {
        try {
            if (!id || !contractAddress || !owner || !price)
                throw new Error("All fields are required to create an NFT");

            // Get the NFT details from the Pinata API
            const tokenURI = await contractWithProvider.tokenURI(id);
            const response = await axios.get(tokenURI);
            const { name, description, image } = response.data;

            const newNFT = new nftModel({
                nftID: id,
                name,
                description,
                contractAddress,
                owner,
                price,
                image
            });

            // Save the new NFT to the database
            await newNFT.save()
                .then(result => {
                    console.log("NFT Minted:", result);
                });

        } catch (error) {
            console.error("Error creating NFT: ", error);
        }

    });

    contractWithProvider.on("NFTTransfer", async (id, seller, buyer, price) => {
        try {
            if (!id) {
                throw new Error("NFT ID is required to update an NFT");
            }

            const nft = await nftModel.findOne({ nftID: id });
            if (!nft) {
                throw new Error("NFT not found");
            }

            await nftModel.findOneAndUpdate({ nftID: id }, {
                name: nft.name,
                description: nft.description,
                owner: buyer,
                price,
            }, { new: true });

        } catch (error) {
            console.error("Error buying NFT: ", error);
        }
    });

}

module.exports = nftEventHandler;