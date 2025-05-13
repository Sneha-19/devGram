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

module.exports = {validation}