const nodemailer = require("nodemailer")
const sendMail = async (message, subject, email) => {


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD
        }
    })

    const mailOptions = {
        from: "nirajlalwani2810@gmail.com",
        to: email,
        subject: subject,
        html: message
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Mail Not Send", error);
            return false;
        } else {
            console.log("Mail Send Successfully")
            return true;
        }
    })
}

module.exports = { sendMail }
