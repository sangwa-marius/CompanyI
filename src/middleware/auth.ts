import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const isauthenticated = async (req:any, res, next) => {
    try {
        const authHeaders = req.headers.authorization;
        if(!authHeaders.includes("Bearer")) return res.status(401).json({message:"Invalid token format"})
        const token = req.headers?.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const decoded:any= jwt.verify(token, process.env.SUPER_SECRET_KEY);
        req.userId = decoded.id
        next();
    } catch (error: any) {
        console.error(error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default isauthenticated;