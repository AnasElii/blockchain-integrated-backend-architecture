const axios = require('axios');
const ethers = require('ethers');
const FormData = require('form-data');
require('dotenv').config();

const { provider, signer, contractWithSigner } = require('../config/ethersConfig');

const getNFTs = async (req, res) => {
    try{
        
    }catch(error){
        console.error("Error getting NFTs: ", error); 
        res.status(500).json({ error: error.message });
    }
}

module.exports = getNFTs;