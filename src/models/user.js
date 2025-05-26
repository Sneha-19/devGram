const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email Id")
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Kindly provide a strong paasword")
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!["Male", "Female", "Others"].includes(value)) {
                throw new Error("Invalid gender type")
            }
        }
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    membershipType: {
        type: String,
    },  
    imageUrl: {
        type: String,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid Image URL")
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about section for the user"
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
});

userSchema.methods.jwtToken = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "SecretKey123", { expiresIn: "1d" });
    return token;
}

userSchema.methods.passwordValidation = async function (passwordByUser) {
    const user = this;
    const isValidPassword = await bcrypt.compare(passwordByUser, user.password);
    return isValidPassword;
}

module.exports = mongoose.model("User", userSchema)