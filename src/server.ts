import express from "express";
import morgan from 'morgan';
import errorHandler from './middleware/error';
import notFound from './middleware/notFound';
import router from './routes/index';
import connectDB from './config/db';
import * as dotenv from 'dotenv';
dotenv.config({ debug: true });


const port = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use('/api/v1', router)
app.use(notFound)
app.use(errorHandler)
connectDB().then(() => {
   app.listen(port, async () => {
      console.log(`Server running on port ${port}`)
   })
})