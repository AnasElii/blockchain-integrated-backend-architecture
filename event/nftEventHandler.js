const ethers = require('ethers');
const axios = require('axios');

const nftModel = require('../models/nftModel');
const eventEmitter = require('./eventEmitter');
const { contractWithProvider } = require('../config/ethersConfig');

const nftEventHandler = async () => {

    // eventEmitter.on('nftMinted', async (data) => {
    //     try {

    //         console.log("Data: ", data);

    //         return;
    //         if (!data.id || !data.uri || !data.price) {
    //             throw new Error("All fields are required to create an NFT");
    //         }

    //         const newNFT = new nftModel({
    //             nftID: data.id,
    //             name: "NFT",
    //             description: "NFT",
    //             contractAddress: contractWithProvider.address,
    //             owner: contractWithProvider.signer.address,
    //             price: data.price,
    //             image: data.uri
    //         });

    //         // Save the new NFT to the database
    //         await newNFT.save()

    //     } catch (error) {
    //         console.error("Error creating NFT: ", error);
    //     }
    // });
    

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

    contractWithProvider.on("NFTTransfer", async (id, seller, buyer) => {
        try {
            // if (!id) {
            //     throw new Error("NFT ID is required to update an NFT");
            // }

            await nftModel.findByIdAndUpdate(id, {
                name: "NFT",
                description: "NFT",
                owner: buyer,
                price,
            }, { new: true });

        } catch (error) {
            console.error("Error buying NFT: ", error);
        }

        // const nft = await nftModel.findOne({ nftID: id });
        // if (nft) {
        //     nft.owner = owner;
        //     nft.price = price;
        //     await nft.save();
        // }
    });

}

module.exports = nftEventHandler;