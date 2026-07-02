import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()
const url = process.env.MONGO_DB_URI;

if (!url) {
    throw new Error("MONGO_DB_URI is not defined in environment variables");
}

const connectDB = async () => {
    try {
        await mongoose.connect(url);
        console.log('Database connected successfully')

    } catch (error: any) {
        console.log("Error: ", error.message)
        throw new Error("Failed to connect to database")
    }
}

export default connectDB;