const express = require("express");
const connectDB = require("./utils/database")
const User = require("./models/user")

const app = express();

const PORT = 5000;

app.post("/signup", async (req, res) => {

    const userData = {
        firstName: "Sneha",
        lastName: "Singh",
        emailId: "sneha@singh.com",
        password: "sneha123"
    };

    const user = new User(userData);
    await user.save()
    res.send("SignUp completed")
})

connectDB().then(() => {
    console.log("Database connected successfully...");
    app.listen(PORT, function(){
        console.log("Server is running on port: ", PORT)
    })
}).catch( (err) => {
    console.log("Database couldn't be connected!")
})

