const { findByIdAndUpdate } = require('../Model/userModel')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const crypto = require('crypto')

const User = require('../Model/userModel')
const Reset = require('../Model/resetPasswordModel')

const { sendMail } = require('../Utils/sendMail')





//********************************************************************************************* */
const register = async (req, res) => {
  try {

    const { name, email, password } = req.body
    let preuser = await User.findOne({ email })
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Fill Data Properly" });
    }
    else if (preuser) {
      if (preuser.isVerified === false) {
        await preuser.deleteOne({ _id: preuser._id })

      } else {
        return res.status(400).json({ error: "User Already Exists" });
      }
    }
    const newUser = await User.create({ name, email, password });
    await newUser.saveVerificationToken({ validateBeforeSave: false });
    newUser.confirmPassword = undefined;
    newUser.save({ validateBeforeSave: false })


    const verificationLink = `${process.env.BASE_URL}/${newUser.verificationToken}/verify/${newUser._id}`;


    //?Construct the HTML content for the email
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

    const emailRes = await sendMail(htmlContent, "Sending Email For Verification", newUser.email)


    return res.status(200).json({ message: "User registered successfully. Please check your email for verification.", newUser });


  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
}
//********************************************************************************************* */





//********************************************************************************************* */
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
//********************************************************************************************* */





//********************************************************************************************* */
const verifyMail = async (req, res) => {
  try {
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
//********************************************************************************************* */






//********************************************************************************************* */
const getData = async (req, res) => {
  try {

    const token = req.body.token;
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
//********************************************************************************************* */





//********************************************************************************************* */
const sendResetPasswordLink = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(404).json({ error: "Email is Required" });
    }
    const isPresent = await User.findOne({ email });
    if (!isPresent) {
      return res.status(404).json({ error: "Account Doesn't Exists" });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');
    const tokenExpires = Date.now() + 10 * 60 * 100;
    const preUser = await Reset.findOne({ email });
    if (preUser) {
      preUser.verificationToken = verificationToken
      await preUser.save();
      var verificationLink = `${process.env.BASE_URL}/resetpassword/${preUser.verificationToken}`;


    } else {
      var user = await Reset.create({ verificationToken, tokenExpires, email });
      var verificationLink = `${process.env.BASE_URL}/resetpassword/${user.verificationToken}`;
    }

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
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
            <h1>Password Reset</h1>
            <p>Click the following link to verify your email address:</p>
            <p><a href="${verificationLink}" style="color:white" class="verification-link">Reset Password</a></p>
            <p>If you did not request this, please ignore this email.</p>
          </div>
        </body>
        </html>
      `;

    await sendMail(htmlContent, "Sending Mail For Password Reset", email);
    res.status(200).json({ "message": "Reset Link Send Successfully.Please check your email." })

  } catch (error) {
    console.log(error)
    return res.status(404).json({ isValid: false });
  }
}
//********************************************************************************************* */





//********************************************************************************************* */
const updatePassword = async (req, res) => {
  try {
    const { verificationToken, password } = req.body;
    const user = await Reset.findOne({ "verificationToken": verificationToken });




    if (!user || user.tokenExpires > Date.now()) {

      return res.status(404).json({ error: "Link is not Valid" });
    }

    const currentUser = await User.findOne({ "email": user.email })

    currentUser.password = password;
    user.tokenExpires = Date.now();
    await user.save();
    await currentUser.save();
    res.status(200).json({ "message": "Password Updated Successfully" });

  } catch (error) {
    console.log(error)
    return res.status(404).json({ error: "Link is not Valid try again" });
  }
}
//********************************************************************************************* */


const getUsers = async (req, res) => {
  try {
    const { _id } = req.params;
    const isAdmin = await User.findOne({ _id });
    if (isAdmin.isAdmin) {
      const allUsers = await User.find();
      return res.status(200).json({ allUsers })
    }
    return res.status(200).json({ "Message": "You Are Not a Admin" });

  } catch (error) {
    console.log(error);
    console.log("Get Users error")
  }
}


const updateIsAdmin = async (req, res) => {
  try {
    let { adminId, _id } = req.params;
    let admin = await User.findById(adminId);
    if (admin.isAdmin) {
      let user = await User.findOne({ _id });
      user.isAdmin = user.isAdmin ? false : true;
      await user.save()
      res.status(200).json({ "Message": "Updated Successfully" })
    }
  } catch (error) {
    console.log(error)
  }
}

const deleteUser = async (req, res) => {
  try {
    let { adminId, _id } = req.params;
    let admin = await User.findById(adminId);
    if (admin.isAdmin) {
      let user = await User.deleteOne({ _id });
      res.status(200).json({ "Message": "Deleted Successfully" })
    }
  } catch (error) {
    console.log(error)
  }
}



module.exports = { register, login, verifyMail, getData, sendResetPasswordLink, updatePassword, getUsers, updateIsAdmin, deleteUser }
