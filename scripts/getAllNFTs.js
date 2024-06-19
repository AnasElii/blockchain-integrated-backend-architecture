const { getInitializedContract } = require("./constants");

async function main() {
    const { marketplace, accounts, listingPrice } = await getInitializedContract();

    console.log("Listing Price", listingPrice);
    // Interact with the smart contract
    const nftsList = await marketplace.getAllNFTs();
    for (let i = 0; i < nftsList.length; i++) {
        console.log("NFT_" + nftsList[i]);

    }

    const nftIds = await marketplace.getNFTIDs();
    console.log("IDs", nftIds);

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });