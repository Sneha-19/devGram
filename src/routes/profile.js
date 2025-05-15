const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { profileEditDataValidation } = require("../utils/validation");
const authRouter = require("./auth");
const validator = require("validator");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

//Fetch user profile
profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user)

    } catch (err) {
        res.status(400).send("ERROR in login : " + err.message)
    }
})

//Edit user profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!profileEditDataValidation(req)) {
            throw new Error("Invalid Profile Information")
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key]
        })

        await loggedInUser.save()
        res.json({ "message": `${loggedInUser.firstName} your profile is updated successfully`, "data": loggedInUser })
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

//Reset Password (Forgot Password)
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const { password, checkPassword } = req.body;

        if (password !== checkPassword) {
            throw new Error("Passwords don not match!")
        }

        if (!validator.isStrongPassword(password)) {
            throw new Error("Kindly provide a strong paasword")
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        user.password = encryptedPassword;
        await user.save();
        res.send("Password updated successfully!")
    } catch (err) {
        res.status(400).send("ERROR : " + res.message)
    }
})

module.exports = profileRouter;