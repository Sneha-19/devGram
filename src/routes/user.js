const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequests = require("../models/connectionRequest");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;

        const requestsReceived = await ConnectionRequests.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName age gender imageUrl about skills");

        res.json({
            message: "Requests Received", 
            data: requestsReceived
        })
    } catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

module.exports = userRouter;