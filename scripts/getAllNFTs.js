const { getInitializedContract } = require("./constants");

async function main() {
    const { marketplace } = await getInitializedContract();

    const nftIds = await marketplace.getNFTIDs();
    console.log("IDs", nftIds);

    console.log("++++++++++++++++++++");
    for (let i = 0; i < nftIds; i++) {
        const nft = await marketplace.getNFT(i);
        console.log("NFT_" + nft.id);
        console.log("NFT Owner", nft.owner);
        console.log("NFT Price", nft.price);
        console.log("NFT Contract Address", nft.contractAddress);

        const nftData = await marketplace.tokenURI(i);
        console.log("NFT Data", nftData);
        console.log("++++++++++++++++++++");
    }

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });