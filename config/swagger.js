require("dotenv").config({quiet:true,debug:true});
const swaggerJSDoc = require('swagger-jsdoc');
const port = process.env.PORT;

const options = {
    definition:{
        openapi: "3.0.0",
        info:{
            title: "A very simple swagger api tester ",
            version: "1.0.0",
            descrption: "This is a simple swagger user interface for testing my apis",
        },
        servers: [
            {
                url :`http://localhost:${port}`,
                descrption:" Development serever",

            }
        ],

        components:{
            securitySchemes:{
                beererSchemes:{
                    type:'http',
                    scheme: 'beerer',
                    beererFormat:'JWT',
                    descrption:'Enter JWT token '
                },
            },
        },

        security:[
            {
                beererAuth: []
            }
        ]

    },
    apis:["./routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
