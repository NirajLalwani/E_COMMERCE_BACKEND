const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Email is Invalid'],
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8, // Minimum length of password
    },
    verificationToken: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    tokenExpires: {
        type: Date,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});


userSchema.methods.generateVerificationToken = function () {
    return crypto.randomBytes(20).toString('hex');
};


userSchema.methods.saveVerificationToken = async function () {
    this.verificationToken = this.generateVerificationToken();
    this.tokenExpires = Date.now() + 10 * 60 * 100;
    await this.save();
};


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = this.password;
    return next()
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this._id }, process.env.SECRET_KEY);
    return token;
}
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;