require("dotenv").config({ quiet: true, debug: true });
const swaggerJSDoc = require("swagger-jsdoc");
const port = process.env.PORT;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "A very simple swagger api tester",
      version: "1.0.0",
      description: "This is a simple swagger user interface for testing my APIs",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Development server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {              
          type: "http",
          scheme: "bearer",        
          bearerFormat: "JWT",
          description: "Enter JWT token",
        },
      },
    },

    security: [
      {
        bearerAuth: [],             
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
