import User from '../models/users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.find({ email: email });
        if (user.length > 0) {
            console.log(user)
            return res.status(400).json({ message: "email registered" })
        }
        const hashed = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashed
        });
        res.status(200).json({
            message: "registered successfully",
            newUser
        })
    } catch (e: any) {
        return next(e);

    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "email and password are require" })
        }
        const user = await User.findOne({ email }).select("+password email username")
        console.log(user)
        if (!user) return res.status(404).json({ message: "User not found" })

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.SUPER_SECRET_KEY,
                { expiresIn: '7d' }
            );
            return res.status(200).json({ message: "Login successfull", token });

        } else {
            return res.status(400).json({ message: "Invalid password" })
        }
    } catch (e: any) {
        return next(e)

    }


}

export { register, login };

