const mongoose = require('mongoose');

const nftModel = new mongoose.Schema({
    nftID:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    contractAddress:{
        type: String,
        required: true
    },
    owner:{
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'User',
        type: String,
        required: true
    },
    price:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('NFT', nftModel);