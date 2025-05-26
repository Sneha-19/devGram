const { subDays, startOfDay, endOfDay } = require("date-fns")
const cron = require("node-cron")
const ConnectionRequestModel = require("../models/connectionRequest")
const SendEmail = require("../utils/sendEmail")

cron.schedule("* * * * * *", async () => {
    //Send email to all people who requests yesterday

    try{
        const yesterday = subDays(new Date(), 1);

        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequests = await ConnectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            }
        }).populate("fromUserId toUserId");

        const listOfEmails = [...new Set(pendingRequests.map(req => req.toUserId.emailId))]

        for(const email of listOfEmails){
            try{
                const res = await SendEmail.run("New friend request from "+email, "There are pending requests, please check!")
            }catch(err) {
                console.error(err)
            }
        }
    }catch(err) {
        console.error(err)
    }
})