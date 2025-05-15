const express = require("express");
const connectDB = require("./utils/database");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const app = express();

const PORT = 5000;

app.use(express.json())
app.use(cookieParser())

app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" , requestRouter);
app.use("/", userRouter);

connectDB().then(() => {
    console.log("Database connected successfully...");
    app.listen(PORT, function () {
        console.log("Server is running on port: ", PORT)
    })
}).catch((err) => {
    console.log("Database couldn't be connected!")
})

