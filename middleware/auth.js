
const jwt = require("jsonwebtoken")
require('dotenv').config();

 const isauthenticated = async (req, res, next) => {
    try {
        const token = req.headers.token
        if (!token) {
            res.status(401).json({ message: "Unauthorized" })
            return
        }

        const decoded= jwt.verify(token, process.env.SUPER_SECRET_KEY)
        // if (!user) {
        //     res.status(401).json({ message: "Access denied" })
        //     return
        // }
        // if (user.email !== "test1@gmail.com") {
        //     res.status(401).json({ message: "Access denied" })
        //     return
        // }

        next()
    } catch (error) {
        console.error(error)
        res.status(401).json({ message: "Invalid token" })
    }
}

module.exports=isauthenticated