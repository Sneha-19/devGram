const express = require("express");

const app = express();

const PORT = 5000;

app.use("/test", (req, res) => {
    res.send("This is a testing page")
})

app.use("/", (req, res) => {
    res.send("Welcome to the DevGram!!!")
})

app.listen(PORT, function(){
    console.log("Server is running on port: ", PORT)
})