const mongoose = require("mongoose");
const validator = require("validator")

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
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email Id")
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
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
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Invalid gender type")
            }
        }
    },
    imageUrl: {
        type: String,
        validate(value){
            if(!validator.isURL(value)){
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

module.exports = mongoose.model("User", userSchema)