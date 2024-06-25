const { readFileSync } = require('fs');
const path = require('path');

const nftModel = require('../models/nftModel');


const fetchMyNFTs = async (req, res) => {
    try {

        // Retrieve the NFTs from the mongodb and return it as a json response
        const NFTs = await nftModel.find().sort({ _id: -1 }).limit(5);
        res.status(200).json({ NFTs });

    } catch (error) {

        console.error("Error getting NFTs: ", error);
        res.status(500).json({ error: error.message });

    }
}

const fetchMyNFTQuery = async (req, res) => {
    try {

        const { owner } = req.body;
        if (!owner) {
            return res.status(400).json({ error: 'No ID provided' });
        }

        function getQuery() {
            return readFileSync('./graphql/schemas/queries/getMyNFTs.graphql', 'utf-8');
        }

        const query = getQuery();
        const variables = { owner, sortField: `_id`, sortOrder: -1, limit: 5, offset: 0};

        const response = await fetch(`http://localhost:${process.env.PORT}/graphql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query, variables }),
        })
        // .then(r => r.json())
        // .then(data => console.log('data returned:', data));

        // Check for successful response
        if (!response.status === 200) {
            throw new Error(`Error getting NFT: ${response.statusText}`);
        }

        NFT = await response.json();

        res.status(200).json({ NFT });
        console.log("NFT: ", NFT);
    } catch (error) {
        console.error("Error getting NFT: ", error);
        res.status(500).json({ error: error.message });
    }

}

const fetchNFTQuery = async (req, res) => {
    try {

        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'No ID provided' });
        }

        function getQuery() {
            return readFileSync('./graphql/schemas/queries/getAllNFTs.graphql', 'utf-8');
        }

        const query = getQuery();
        const variables = { id };


        // const NFT = await nftModel.findById(id);
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

        res.status(200).json({ NFT });
        console.log("NFT: ", NFT);
    } catch (error) {
        console.error("Error getting NFT: ", error);
        res.status(500).json({ error: error.message });
    }

}

module.exports = { fetchMyNFTs, fetchMyNFTQuery };