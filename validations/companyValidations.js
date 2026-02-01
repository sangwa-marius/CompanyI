const joi = require('joi');

const addCompanySchema  = joi.object({
    name: joi.string().required().trim(),
    code: joi.string().required().uppercase(),
    email: joi.string().email().messages({'string.email':'email must be a valid email'}),
    phone: joi.string(),
    address: joi.string(),
    isActive: joi.boolean().default(true)  
});


const updateCompanyByIdSchema = joi.object({
    name: joi.string().trim(),
    code: joi.string().uppercase(),
    email: joi.string().email(),
    phone: joi.string(),
    address: joi.string(),
    isActive: joi.boolean().default(true)  
})


module.exports = {
    addCompanySchema,
    updateCompanyByIdSchema
}