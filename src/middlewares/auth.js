const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            throw new Error("JWT token doesn't exist!!!")
        }

        const decodedToken = await jwt.verify(token, "SecretKey123");

        const { _id } = decodedToken;
        const user = await User.findById({ _id });

        if (!user) {
            throw new Error("Login to access!!")
        } else {
            req.user = user;
            next();
        }
    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }

}

module.exports = { userAuth }