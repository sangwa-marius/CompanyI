import express from "express";
import morgan from 'morgan';
import errorHandler from './middleware/error';
import notFound from './middleware/notFound';
import router from './routes/index';
import connectDB from './config/db';
import cors from 'cors'
import * as dotenv from 'dotenv';
dotenv.config({ debug: true });


const port = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors({
   origin:"*",
   allowedHeaders: ["Authorization", "Content-Type"],
}))
app.use('/api', router)
app.use(notFound)
app.use(errorHandler)
connectDB().then(() => {
    app.listen(port, async () => {
       console.log(`Server running on port ${port}`)
    })
}).catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
})