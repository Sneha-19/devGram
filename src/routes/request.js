const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:userId", userAuth, async (req,res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        const connectionRequest = new ConnectionRequest({fromUserId, toUserId, status});
        await connectionRequest.save();
        res.send("Request created successfully!!")
    } catch(err) {
        res.status(400).send("ERROR : " + err.message)
    }
})

module.exports = requestRouter;