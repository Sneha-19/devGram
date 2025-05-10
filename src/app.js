const express = require("express");
const connectDB = require("./utils/database")
const User = require("./models/user")

const app = express();

const PORT = 5000;

app.use(express.json())

app.post("/signUp", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save()
        res.send("SignUp completed")
    } catch(err) {
        res.status(400).send("Error in signup:", err.message)
    }
})

connectDB().then(() => {
    console.log("Database connected successfully...");
    app.listen(PORT, function(){
        console.log("Server is running on port: ", PORT)
    })
}).catch( (err) => {
    console.log("Database couldn't be connected!")
})

