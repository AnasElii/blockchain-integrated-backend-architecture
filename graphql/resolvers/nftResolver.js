const nftModel = require('../../models/nftModel');

const nftResolver = {
    Query: {
        nfts: async () => {
            try {
                const nfts = await nftModel.find();
                return nfts;
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        createNFT: async (args) => {
            try {

                const { nftID, name, description, contractAddress, owner, price, image } = args;
                if (!nftID || !name || !description || !contractAddress || !owner || !price || !image) {
                    throw new Error("All fields are required to create an NFT");
                }

                const newNFT = new nftModel({
                    nftID,
                    name,
                    description,
                    contractAddress,
                    owner,
                    price,
                    image
                });

                // Save the new NFT to the database
                const savedNFT = await newNFT.save()
                    .then(result => {
                        console.log("NFT Minted:", result);
                    });

                return savedNFT;
            } catch (error) {
                console.error("Error creating NFT: ", error);
            }
        },
        updateNFT: async (args) => {
            try {
                const { id, name, description, owner, price } = args;
                
                if (!id) {
                    throw new Error("NFT ID is required to update an NFT");
                }

                const updatedNFT = await nftModel.findByIdAndUpdate(id, {
                    name,
                    description,
                    owner,
                    price,
                }, { new: true });

                return updatedNFT;

            } catch (err) {
                throw new Error("Error buying NFT: ", err);
            }
        }
    }
}

module.exports = nftResolver;