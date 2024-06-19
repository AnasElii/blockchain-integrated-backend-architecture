const FormData = require('form-data');

// Define Pinata API endpoints and headers
const PINATA_FILE_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const PINATA_METADATA_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

const pinToIPFS = async (url, data, apiType) => {
    let pinataHeaders = {};

    // Set the headers for the Pinata API
    if (apiType === "FILE") {
        pinataHeaders = {
            Authorization: `Bearer ${process.env.PINATA_JWT_TOKEN}`,
        };
    }
    if (apiType === "JSON") {
        pinataHeaders = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.PINATA_JWT_TOKEN}`,
        };
    }

    try {

        // Make a POST request to Pinata API
        const response = await fetch(url, {
            method: "POST",
            headers: { ...pinataHeaders },
            body: data,
        });

        // Check for successful response
        if (!response.ok) {
            throw new Error(`Error pinning to IPFS: ${response.statusText}`);
        }

        // Parse and return the response JSON
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Error pinning to IPFS: ", error);
        throw error;
    }
}

// Handle incoming HTTP POST requests
const POST = async (req, res) => {
    try {
        // Extract relevant data from the fields
        const NFT_NAME = req.body.name;
        const NFT_DESCRIPTION = req.body.description;
        const NFT_PRICE = req.body.price;
        const NFT_IMAGE = req.file;

        // Validate required fields
        if (!NFT_NAME || !NFT_DESCRIPTION || !NFT_PRICE || !NFT_IMAGE) {
            throw new Error("Missing required NFT data fields");
        }

        // Create a new FormData object for the image data
        const fileData = new FormData();
        fileData.append("file", NFT_IMAGE.buffer);
        fileData.append("pinataMetadata", JSON.stringify({
            name: NFT_NAME,
        }));

        // Pin the image to IPFS
        const imageCID = await pinToIPFS(PINATA_FILE_URL, fileData, "FILE");

        // Create metadata object for the NFT
        const nftMetadata = {
            name: NFT_NAME,
            description: NFT_DESCRIPTION,
            price: NFT_PRICE,
            image: `ipfs://${imageCID.IpfsHash}`,
        };

        // Pin the metadata to IPFS
        const metadataCID = await pinToIPFS(
            PINATA_METADATA_URL,
            JSON.stringify(nftMetadata),
            "JSON"
        );

        // Return the IPFS CID of the metadata
        console.log("Metadata successfully pinned: ", metadataCID.IpfsHash);
        return new Response(JSON.stringify({ IpfsHash: metadataCID.IpfsHash }), {
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("POST Error pinning to IPFS: ", error);
        return new Response(JSON.stringify({ error: "Error pinning to IPFS", message: error.message }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}

module.exports = { pinToIPFS, POST };