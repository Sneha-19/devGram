const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:userId", userAuth, async (req,res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        const allowedStatus = ["interested", "ignored"];
        if(!allowedStatus.includes(status)){
            throw new Error("Incorrect status!")
        }

        const existsInDb = await User.findById(toUserId);
        if(!existsInDb){
            throw new Error("Incorrect User Id, User doesn't exist!")
        }

        const isCrossRequest = await ConnectionRequest.find({
            $or : [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })
        if(isCrossRequest){
            throw new Error("Request already sent!!")
        }

        const connectionRequest = new ConnectionRequest({fromUserId, toUserId, status});
        await connectionRequest.save();
        res.send("Request created successfully!!")
    } catch(err) {
        res.status(400).send("ERROR : " + err.message)
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try{

        const loggedInUser = req.user;
        const {status , requestId} = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            res.status(400).json({
                message: "Incorrect request status"
            })
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser,
            status: "interested"
        })

        if(!connectionRequest){
            res.status(400).json({
                message: "Invalid Request!!"
            })
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message: `Request ${status}`,
            data
        })
    } catch(err) {
        res.status(400).send("ERROR : " + err.message)
    }
})

module.exports = requestRouter;