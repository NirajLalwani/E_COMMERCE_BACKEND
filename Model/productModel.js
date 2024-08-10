const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    "images": {
        type: "array"
    },
    "stock": {
        "type": Number
    },
    "name": {
        "type": String
    },
    "price": {
        "type": Number
    },
    "description": {
        "type": String
    },
    "isFeatured": {
        "type": Boolean
    },
    "isNewlyLaunched": {
        "type": Boolean
    },
    "category": {
        "type": String
    },
    "company": {
        "type": String
    },
    "ratings": {
        "type": Number
    },
    "reviews": {
        "type": Number
    }
})

const model = mongoose.model('product', schema)

module.exports = model;