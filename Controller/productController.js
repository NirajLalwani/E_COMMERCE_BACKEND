const Product = require("../Model/productModel")

const getData = async (req, res) => {
    try {
        const data = await Product.find();
        res.status(200).json({ data })
    } catch (error) {
        res.status(500).json({ error:"Internal Server Error" });
        console.log(error)
    }
}




module.exports = { getData };