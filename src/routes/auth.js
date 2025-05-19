const express = require("express");
const { validation } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

const authRouter = express.Router();

//Add a user
authRouter.post("/signUp", async (req, res) => {

    try {
        validation(req);

        const { firstName, lastName, emailId, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName, lastName, emailId, password: passwordHash
        });

        await user.save()
        res.send("SignUp completed")
    } catch (err) {
        res.status(400).send("Error in signup:" + err.message)
    }
})

//Login 
authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        
        if (!validator.isEmail(emailId)) {
            res.status(400).send("Invalid Email format")
        }

        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            res.status(400).send("Invalid credentials")
        }

        isValidPassword = await user.passwordValidation(password);

        if (!isValidPassword) {
            res.status(400).send("Invalid credentials")
        } else {
            //Create a JWT
            const token = await user.jwtToken();

            //Send the token in a cookie
            res.cookie("token", token);

            res.send(user)
        }
    } catch (err) {
        res.status(400).send("ERROR in login : " + err.message)
    }
})

//Logout
authRouter.post("/logout", async (req,res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    });
    res.send("Logged out successfully")
})

module.exports = authRouter;