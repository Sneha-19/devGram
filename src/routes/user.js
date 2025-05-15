const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequests = require("../models/connectionRequest");

const SAFE_STRING = "firstName lastName age gender imageUrl about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;

        const requestsReceived = await ConnectionRequests.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", SAFE_STRING);

        res.json({
            message: "Requests Received", 
            data: requestsReceived
        })
    } catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

userRouter.get("/user/connections", userAuth, async (req,res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequests.find({
            $or : [
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", SAFE_STRING).populate("toUserId", SAFE_STRING);

        const data = connectionRequests.map(row => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId
        })

        res.json({data})
    } catch(err) {
        res.status(400).send("ERROR :" + err.message)
    }
})

module.exports = userRouter;