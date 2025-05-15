const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequests = require("../models/connectionRequest");
const User = require("../models/user");

const SAFE_STRING = "firstName lastName age gender imageUrl about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const requestsReceived = await ConnectionRequests.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", SAFE_STRING);

        res.json({
            message: "Requests Received",
            data: requestsReceived
        })
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequests.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", SAFE_STRING).populate("toUserId", SAFE_STRING);

        const data = connectionRequests.map(row => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId
        })

        res.json({ data })
    } catch (err) {
        res.status(400).send("ERROR :" + err.message)
    }
})

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectedUsers = await ConnectionRequests.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

        const connectUsersSet = new Set();

        connectedUsers.forEach((user) => {
            connectUsersSet.add(user.fromUserId.toString());
            connectUsersSet.add(user.toUserId.toString());
        })

        const nonConnectedUsers = await User.find({
           $and : [
            {_id : { $nin : Array.from(connectUsersSet)}},
            {_id : {$ne : loggedInUser._id}}
           ]
        }).select(SAFE_STRING)

        res.json({
            data: nonConnectedUsers
        })
    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
})

module.exports = userRouter;