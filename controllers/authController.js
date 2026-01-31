const User = require('../models/users');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || email.length === 0) {
            return res.status(400).json({ message: "username,email and password are requred" });
        }
        const user = await User.find({ email: email });
        if (user.length > 0) {
            console.log(user)
            return res.status(400).json({ message: "email registered" })
        }
        const hashed = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashed
        });
        res.status(200).json({ message: "registered successfully" })

    } catch (e) {
        e.status = 500;
        return next(e);

    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "email and password are require" })
        }
        const user = await User.findOne({ email });

        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ user:"goal" }, process.env.SUPER_SECRET_KEY);
            console.log(token)
            return res.status(200).json({ message: "Login successfull",token : token });

        } else {
            return res.status(400).json({ message: "Invalid password" })
        }
    } catch (er) {
        console.error(er)
        er.status = 500;
        return next(er)

    }


}

module.exports = { register, login };

