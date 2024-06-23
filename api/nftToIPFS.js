const axios = require('axios');
const FormData = require('form-data');

require('dotenv').config();

// Define Pinata API endpoints and headers
const PINATA_FILE_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const PINATA_METADATA_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

// Extract file data from the request
function extractFileData(data) {
    let fileBuffer;
    let fileName;

    data._streams.forEach(stream => {
        if (typeof stream === 'string') {
            if (stream.includes('filename=')) {
                const match = stream.match(/filename="(.+?)"/);
                if (match) {
                    fileName = match[1];
                }
            }
        } else if (Buffer.isBuffer(stream)) {
            fileBuffer = stream;
        }
    });

    return { fileBuffer, fileName };
}

const pinJSONToIPFS = async (url, data) => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.PINATA_JWT_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: data,
    });

    // Check for successful response
    if (!response.ok) {
        throw new Error(`Error pinning to IPFS: ${response.statusText}`);
    }

    return await response.json();
};

const pinFileToIPFS = async (url, data) => {
    let { fileBuffer, fileName } = extractFileData(data);

    const fileData = new FormData();
    fileData.append('file', fileBuffer, fileName);

    const response = await axios.post(
        url,
        fileData,
        {
            headers: {
                Authorization: `Bearer ${process.env.PINATA_JWT_TOKEN}`,
            },
        }
    );

    // Check for successful response
    if (response.statusText !== 'OK') {
        throw new Error(`Error pinning to IPFS: ${response.statusText}`);
    }

    return response.data;
};

const pinToIPFS = async (url, data, apiType) => {
    try {

        if (apiType === "JSON") {
            return await pinJSONToIPFS(url, data);
        }

        if (apiType === "FILE") {
            return await pinFileToIPFS(url, data);
        }

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
        fileData.append("file", req.file.buffer, NFT_NAME);
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
        return res.status(200).json({ IpfsHash: metadataCID.IpfsHash, image: nftMetadata.image, message: "NFT pinned to IPFS"});
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