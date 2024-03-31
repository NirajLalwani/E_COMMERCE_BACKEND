const { findByIdAndUpdate } = require('../Model/userModel')
const jwt = require("jsonwebtoken")
const User = require('../Model/userModel')
const { sendMail } = require('../Utils/sendMail')
const register = async (req, res) => {
    try {
        console.log("Req send", req.body)
        const { name, email, password, confirmPassword } = req.body
        let preuser = await User.findOne({ email })
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: "Fill Data Properly" });
        }
        else if (preuser) {
            if (preuser.isVerified === false) {
                await preuser.deleteOne({ _id: preuser._id })
                console.log("deletedSuccessfully");
            } else {
                return res.status(400).json({ error: "User Already Exists" });
            }
        }
        const newUser = await User.create({ name, email, password, confirmPassword });
        await newUser.saveVerificationToken({ validateBeforeSave: false });
        newUser.confirmPassword = undefined;
        newUser.save({ validateBeforeSave: false })


        const verificationLink = `${process.env.BASE_URL}/${newUser.verificationToken}/verify/${newUser._id}`;



        // Construct the HTML content for the email
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 10px;
                background-color: #fff;
              }
              h1 {
                color: #333;
              }
              p {
                margin-bottom: 20px;
              }
              .verification-link {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
              }
              .verification-link:hover {
                background-color: #0056b3;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Email Verification</h1>
              <p>Click the following link to verify your email address:</p>
              <p><a href="${verificationLink}" style="color:white" class="verification-link">Verify Email</a></p>
              <p>If you did not request this, please ignore this email.</p>
            </div>
          </body>
          </html>
        `;

        await sendMail(htmlContent, newUser.email)

        return res.status(200).json({ message: "User registered successfully. Please check your email for verification.", newUser });

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Fill Data Properly" });
        }
        const user = await User.findOne({ email, isVerified: true })
        if (!user) {
            return res.status(400).json({ error: "Invalid Email or Password" });
        }
        const validPassword = await user.comparePassword(password);
        console.log(validPassword)
        if (!validPassword) {
            return res.status(400).json({ error: "Invalid Email or Password" });
        }
        const token = user.generateAuthToken()
        res.status(200).send({ message: "Login Successfully", token })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
        console.log(error)
    }
}

const verifyMail = async (req, res) => {
    try {
        // const Date = new Date()
        res.json({"YES":"API CALLED"});
        const currentDate = Date.now();

        const { _id, token } = req.params
        const user = await User.findOne({ _id, verificationToken: token });
        if (!user) {
            return res.status(400).json({ error: "User Not Found" });
        } else if (currentDate > user.tokenExpires) {
            return res.status(400).json({ error: "Link Expired" });
        } else {
            user.isVerified = true;
            user.verificationToken = undefined;
            user.tokenExpires = undefined;
            await user.save({ validateBeforeSave: false });
            const token = user.generateAuthToken()
            return res.status(200).json({ Message: "Verified Successfully", token });
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: "User Not Found" });
    }
}
const resendMail = async (req, res) => {
    try {
        // const Date = new Date()
        const currentDate = Date.now();
        console.log(req.body)
        const { _id, token } = req.body
        const user = await User.findOne({ _id, verificationToken: token });
        if (!user) {
            return res.status(404).json({ error: "User Not Found" });
        }
        await user.saveVerificationToken();
        console.log(currentDate)
        await sendMail(`<a href="${process.env.BASE_URL}/${user.verificationToken}/verify/${user._id}">Verify</a>`, user.email)
        return res.status(200).json({ error: "Mail Send Successfully" });
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: "User Not Found" });
    }
}

const getData = async (req, res) => {
    try {

        const token = req.body.token;
        console.log(token);
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const data = await User.findOne({ _id: decoded.id }, { password: 0 })
        if (data) {
            return res.status(200).json({ isValid: true, data });
        } else {
            return res.status(404).json({ isValid: false });
        }
    } catch (error) {
        return res.status(404).json({ isValid: false });
    }
}

module.exports = { register, login, verifyMail, resendMail, getData }
