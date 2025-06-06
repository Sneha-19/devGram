const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).send("Unauthorized user")
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

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