const express = require("express");
const connectDB = require("./utils/database");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");
require('dotenv').config()

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" , requestRouter);
app.use("/", userRouter);

connectDB().then(() => {
    console.log("Database connected successfully...");
    app.listen(process.env.PORT, function () {
        console.log("Server is running on port: ", process.env.PORT)
    })
}).catch((err) => {
    console.log("Database couldn't be connected!")
})

