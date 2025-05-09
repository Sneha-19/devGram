const express = require("express");

const app = express();

const PORT = 5000;

app.get("/user/:userId", (req,res) => {
    console.log(req.params);
    res.send("Param example")
})

app.get("/user", (req,res) => {
    console.log(req.query);
    res.send("Query printed")
    //call url: localhost:5000/user?name=Sneha
})

app.get("/user", (req, res) => {
    res.send({firstname: "Sneha", lastname: "Singh"})
})

app.post("/user", (req, res) => {
    res.send("Data sent successfully")
})

app.delete("/user", (req,res) => {
    res.send("Deleted the data")
})

app.use("/test", (req, res) => {
    res.send("This is a testing page")
})

app.use("/", (req, res) => {
    res.send("Welcome to the DevGram!!!")
})

app.listen(PORT, function(){
    console.log("Server is running on port: ", PORT)
})