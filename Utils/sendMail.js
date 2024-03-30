const nodemailer = require("nodemailer")
const sendMail = async (message, email) => {


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "nirajlalwani2810@gmail.com",
            pass: 'ejfc fhii murh wmpy'
        }
    })

    const mailOptions = {
        from: "nirajlalwani2810@gmail.com",
        to: email,
        subject: "Sending Email For Verification",
        html: message
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.status(400).json({ error: "email not send" })
        } else {
            res.status(200).json({ message: "Email send Successfully" })
        }
    })
}

module.exports = { sendMail }
