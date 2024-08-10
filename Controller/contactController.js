const Contact = require('../Model/contactModel')
const User = require('../Model/userModel')

const contact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        await Contact.create({ name, email, message });
        res.status(200).json({ message: "Message Send Successfully" });
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: "Message Not Send" });
    }
}

const getMessages = async (req, res) => {
    try {
        const { _id } = req.params;
        const isAdmin = await User.findOne({ _id });
        if (isAdmin.isAdmin) {
            const allMessages = await Contact.find();
            return res.status(200).json({ allMessages })
        }
        return res.status(200).json({ "Message": "You Are Not a Admin" });

    } catch (error) {
        console.log(error);
        console.log("Get Users error")
    }
}

const deleteMessage = async (req, res) => {
    try {
        let { adminId, _id } = req.params;
        let admin = await User.findById(adminId);
        if (admin.isAdmin) {
            let user = await Contact.deleteOne({ _id });
            res.status(200).json({ "Message": "Deleted Successfully" })
        }
    } catch (error) {
        console.log(error)
    }
}


module.exports = { contact, getMessages, deleteMessage }