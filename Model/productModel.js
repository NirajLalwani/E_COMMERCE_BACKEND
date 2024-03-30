const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    "images": {
        type: "array"
    },
    "stock": {
        "type": Number
    },
    "name": {
        "type": "string"
    },
    "price": {
        "type": "number"
    },
    "description": {
        "type": "string"
    },
    "isFeatured": {
        "type": "boolean"
    },
    "category": {
        "type": "string"
    },
    "company": {
        "type": "string"
    },
    "ratings": {
        "type": "number"
    },
    "reviews": {
        "type": Number
    }
})

const model = mongoose.model('product', schema)

module.exports = model;