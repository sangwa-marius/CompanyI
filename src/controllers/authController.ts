import { Request, Response, NextFunction } from 'express';
import User from '../models/users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { CustomError } from '../utils/customError';
dotenv.config();


const register = async (
    req: Request<{}, {}, { username: string, email: string, password: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        let { username, email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (user) {
            const err = new CustomError("Email already registered", 400)
            next(err)
            return;
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

const login = async (
    req: Request<{}, {}, { email: string, password: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            const err = new CustomError("email and password are require", 400);
            next(err);
            return;
        }
        const user = await User.findOne({ email }).select("+password email username");
        const loggedInUser = await User.findOne({ email }).select("-createdAt -updatedAt -__v");
        if (!user) {
            const err = new CustomError("User not found", 404);
            next(err);
            return;
        }

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.SUPER_SECRET_KEY,
                { expiresIn: '7d' }
            );
            return res.status(200).json({
                message: "Login successfull",
                token,
                loggedInUser
            });

        } else {
            const err = new CustomError("Invalid password", 400);
            next(err)
            return
        }
    } catch (e: any) {
        return next(e)

    }


}

export { register, login };

