const mongoose = require('mongoose');

const  userModel = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    nfts: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'NFT'
        }],
        required: true
    }
});

module.exports = mongoose.model('User', userModel);