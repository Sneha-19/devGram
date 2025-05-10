const isAdmin = (req, res, next) => {
    const token = "xyz123";
    const isAdminUser = token === "xyz";
    if(!isAdminUser){
        res.status(401).send("Unauthorized User")
    } else {
        next()
    }
}

const userAuth = (req, res, next) => {
    const token = 123
    const isValidUser = token === 123
    if(!isValidUser){
        res.status(401).send("Unauthorized user");
    } else {
        next()
    }
}

module.exports = {isAdmin, userAuth}