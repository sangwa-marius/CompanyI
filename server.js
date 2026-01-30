const express = require('express');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger')
const path = require('path');
const project = require('./routes/projectRoutes')
const company = require('./routes/companyRoutes')
const errorHandler = require('./middleware/error');
const logger = require('./middleware/logger');
const employee = require('./routes/employeeRoutes');
const notFound = require('./middleware/notFound')
mongoose.connect('mongodb://localhost:27017/enterprise');
const port = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extende: false }));
app.use(logger);
app.use('/api-docs', swaggerUI.serve , swaggerUI.setup(swaggerSpec));
// app.use(express.static(path.join(__dirname, 'public')))
app.use('/api/employee', employee);
app.use('/api',project);
app.use('/api', company);
app.use(notFound)
app.use(errorHandler)
app.listen(port, async () => {
   console.log(`server running on port ${port}`);
   console.log(`Swagger docs on http://localhost:${port}/api-docs`)
})