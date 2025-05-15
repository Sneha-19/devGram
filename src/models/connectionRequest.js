const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    status : {
        type: String,
        enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: '{VALUE} is not a valid status'
        }
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);