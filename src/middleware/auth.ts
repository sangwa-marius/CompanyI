import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {Response,NextFunction } from 'express';

dotenv.config({ path: '../.env' });

const isAuthenticated = async (req:any, res:Response, next:NextFunction) => {
    try {
        const authHeaders = req.headers.authorization;
        if(!authHeaders) return res.json({"message":"Please login"})
        if (!authHeaders.startsWith("Bearer")) return res.status(401).json({ message: "Invalid token format" })
        const token = req.headers?.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const decoded: any = jwt.verify(token, process.env.SUPER_SECRET_KEY);
        req.userId = decoded.id
        next();
    } catch (error: any) {
        console.error(error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default isAuthenticated;