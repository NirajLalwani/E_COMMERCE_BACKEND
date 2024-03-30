const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    message: {
        type: String,
        required: true
    }
})


const Contact = mongoose.model('contact', schema);

module.exports = Contact;