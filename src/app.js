const express = require("express");
const connectDB = require("./utils/database")
const User = require("./models/user");
const {validation} = require("./utils/validation");
const bcrypt = require('bcrypt');

const app = express();

const PORT = 5000;

app.use(express.json())

//Add a user
app.post("/signUp", async (req, res) => {
    

    try {
        validation(req);

        const {firstName, lastName, emailId, password} = req.body;

        const passwordHash = await bcrypt.hash(password, 10);
        
        const user = new User({
            firstName, lastName, emailId, password : passwordHash
        });

        await user.save()
        res.send("SignUp completed")
    } catch (err) {
        res.status(400).send("Error in signup:"+ err.message)
    }
})

//Fetch one user
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const users = await User.find({ emailId: userEmail });
        if (users.length === 0) {
            res.status(400).send("User not found")
        } else {
            res.send(users)
        }
    } catch (err) {
        res.status(400).send("Semething went wrong")
    }
})

//Fetch all the user
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users)
    } catch (err) {
        res.status(400).send("Semething went wrong")
    }
})

//Delete a user
app.delete("/user", async (req, res) => {
    try {
        const userId = req.body.userId;
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully")
    } catch (err) {
        res.status(400).send("Semething went wrong")
    }
})

//Update a user
app.patch("/user/:userId", async (req,res) => {
    const userId = req.params?.userId;
    const userData = req.body;

    try {
        const ALLOWED_DATA = ["age", "gender", "imageUrl", "about", "skills"];

        const isAllowedData = Object.keys(userData).every( (key) => ALLOWED_DATA.includes(key))

        if(!isAllowedData){
            throw new Error("Trying to add invalid data")
        }

        const updatedUser = await User.findByIdAndUpdate({_id : userId}, userData, {returnDocument: "after", runValidators: true});
        console.log(updatedUser);
        res.send("User updated successfully")
    } catch (err) {
        res.status(400).send("Semething went wrong"+ err.message)
    }
})

connectDB().then(() => {
    console.log("Database connected successfully...");
    app.listen(PORT, function () {
        console.log("Server is running on port: ", PORT)
    })
}).catch((err) => {
    console.log("Database couldn't be connected!")
})

