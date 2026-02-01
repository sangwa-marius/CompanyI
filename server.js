require('dotenv').config({debug:true})
const express = require('express');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const path = require('path');
const morgan = require('morgan');
const debug = require('debug')('app:server')
const errorHandler = require('./middleware/error');
const notFound = require('./middleware/notFound');
const router = require('./routes/index');
mongoose.connect('mongodb://localhost:27017/enterprise');

const port = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extende: false }));
app.use(morgan('dev'));

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use('/api/v1',router)
app.use(notFound)
app.use(errorHandler)
app.listen(port, async () => {
   debug(`server running on port ${port}`);
   debug(`Swagger docs on http://localhost:${port}/api-docs`)
})