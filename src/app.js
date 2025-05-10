const express = require("express");
const connectDB = require("./utils/database")

const app = express();

const PORT = 5000;

connectDB().then(() => {
    console.log("Database connected successfully...");
    app.listen(PORT, function(){
        console.log("Server is running on port: ", PORT)
    })
}).catch( (err) => {
    console.log("Database couldn't be connected!")
})

