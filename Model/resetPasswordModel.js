const mongoose = require('mongoose');

const resetSchema = new mongoose.Schema({
    verificationToken: {
        type: String,
        unique: true,
        required: true
    },
    tokenExpires: {
        type: Date,
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});


const Model = mongoose.model('resetLink', resetSchema)

module.exports = Model;