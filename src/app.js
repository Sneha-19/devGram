const express = require("express");
const connectDB = require("./utils/database")
const User = require("./models/user");
const { validation } = require("./utils/validation");
const bcrypt = require('bcrypt');
const validator = require('validator');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

const PORT = 5000;

app.use(express.json())
app.use(cookieParser())

//Add a user
app.post("/signUp", async (req, res) => {


    try {
        validation(req);

        const { firstName, lastName, emailId, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName, lastName, emailId, password: passwordHash
        });

        await user.save()
        res.send("SignUp completed")
    } catch (err) {
        res.status(400).send("Error in signup:" + err.message)
    }
})

//Login 
app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!validator.isEmail(emailId)) {
            res.status(400).send("Invalid Email format")
        }

        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            res.status(400).send("Invalid credentials")
        }

        isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            res.status(400).send("Invalid credentials")
        } else {
            //Create a JWT
            const token = await jwt.sign({ _id: user._id }, "SecretKey123", {expiresIn: "1d"})

            //Send the token in a cookie
            res.cookie("token", token);

            res.send("Logged In Successfully")
        }
    } catch (err) {
        res.status(400).send("ERROR in login : " + err.message)
    }
})

//Fetch user profile
app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user)

    } catch (err) {
        res.status(400).send("ERROR in login : " + err.message)
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

