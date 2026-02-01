const joi = require('joi');

const validate = (schema)=>{
    return (req,res,next) =>{
        const {error} = schema.validate(req.body,{stripUnknown: true,abortEarly:false });
        if(error){
            return res.status(400).json({
                message: "Validat Error",
                errors: error.details.map(detail =>detail.message)
            });
        }
        next();
    };
}


module.exports = validate;