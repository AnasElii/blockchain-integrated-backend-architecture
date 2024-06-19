const ethers = require('ethers');
const nftModel = require('../models/nftModel');
const { contract } = require('../config/ethersConfig');

const nftEventHandler = async () => {
    contract.on("NFTListed", async (id, contractAddress, owner, price) => {

        try {
            // if (!nftID || !contractAddress || !owner || !price)
            //     throw new Error("All fields are required to create an NFT");

            const newNFT = new nftModel({
                nftID: id,
                name: "NFT",
                description: "NFT",
                contractAddress,
                owner,
                price,
                image: `https://ipfs.io/ipfs/${process.env.IPFS_CID}`
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

    contract.on("NFTTransfer", async (id, seller, buyer) => {
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