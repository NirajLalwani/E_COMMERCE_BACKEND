const Product = require("../Model/productModel")
const User = require("../Model/userModel")
const getData = async (req, res) => {
    try {
        const data = await Product.find();
        res.status(200).json({ data })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
        console.log(error)
    }
}

const addData = async (req, res) => {
    try {

        const { data, _id } = req.body;
        const user = await User.findOne({ _id });
        if (user.isAdmin) {
            await Product.create({ ...data });
            res.status(200).json({ "Message": "Product Added Successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const updateProduct = async (req, res) => {
    try {
        const { data, _id } = req.body;
        const user = await User.findOne({ _id });
        if (user.isAdmin) {
            const { name, price, images, reviews, ratings, isNewlyLaunched, isFeatured, description, stock, company, category, _id: productId } = data
            await Product.updateOne({ _id: productId }, { $set: { name, price, images, reviews, ratings, isNewlyLaunched, isFeatured, description, stock, company, category } });
            res.status(200).json({ "Message": "Product Updated Successfully" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const deleteProduct = async (req, res) => {
    try {

        const { productId, _id } = req.params;
        const user = await User.findOne({ _id });
        if (user.isAdmin) {
            await Product.deleteOne({ _id: productId });
            res.status(200).json({ "Message": "Product Deleted Successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}





module.exports = { getData, addData, deleteProduct, updateProduct };