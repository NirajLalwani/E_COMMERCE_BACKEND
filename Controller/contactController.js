const Contact = require('../Model/contactModel')

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

module.exports = { contact }