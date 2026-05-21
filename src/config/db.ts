import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()
const url = process.env.MONGO_DB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(url);
        console.log('Database connected successfully')

    } catch (error: any) {
        console.log("Error: ", error.message)

    }
}

export default connectDB;