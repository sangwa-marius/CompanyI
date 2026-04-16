import mongoose from 'mongoose';
const url = 'mongodb://localhost:27017/enterprise';

const connectDB = async () => {
    try {
        await mongoose.connect(url);
        console.log('Database connected successfully')

    } catch (error: any) {
        console.log("Error: ", error.message)

    }
}

export default connectDB;