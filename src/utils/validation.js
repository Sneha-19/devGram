const validator = require("validator");

const validation = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName) {
        throw new Error("Name is mandatory");
    }

    if(!validator.isEmail(emailId)){
        throw new Error("Invalid Email ID")
    }

    if(!validator.isStrongPassword(password)){
        throw new Error("PLease enter a strong password")
    }
}

const profileEditDataValidation = (req) => {
    const validFields = ["firstName", "lastName", "emailId", "age", "imageUrl", "gender", "about", "skills"];

    const isValidEditData = Object.keys(req.body).every((key) => validFields.includes(key));

    return isValidEditData;
}

module.exports = {validation, profileEditDataValidation}