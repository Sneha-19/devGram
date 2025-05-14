const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {profileEditDataValidation} = require("../utils/validation");

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
profileRouter.patch("/profile/edit", userAuth, async (req,res) => {
    try{
        if(!profileEditDataValidation(req)){
            throw new Error("Invalid Profile Information")
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key]
        })

        await loggedInUser.save()
        res.json({"message": `${loggedInUser.firstName} your profile is updated successfully`, "data": loggedInUser})
    } catch(err) {
        res.status(400).send("ERROR : "+ err.message);
    }
})

module.exports = profileRouter;