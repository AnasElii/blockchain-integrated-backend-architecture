const { readFileSync } = require('fs');
const path = require('path');

const nftModel = require('../models/nftModel');

const updateNFTQuery = async (req, res) => {
    try {

        const { id, name, description, owner, price } = req.body;

        if (!id || !price) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        function getQuery() {
            return readFileSync('./graphql/schemas/queries/updateNFT.graphql', 'utf-8');
        }

        const query = getQuery();
        const variables = { id, name, description, owner, price };

        const response = await fetch(`http://localhost:${process.env.PORT}/graphql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query, variables }),
        })

        // Check for successful response
        if (!response.status === 200) {
            throw new Error(`Error getting NFT: ${response.statusText}`);
        }

        NFT = await response.json();
        return NFT;

    } catch (error) {

        console.error("Error getting NFT: ", error);
        res.status(500).json({ error: error.message });

    }

}

module.exports = { updateNFTQuery };