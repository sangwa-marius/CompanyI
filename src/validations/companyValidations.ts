import * as Joi from 'joi';

const addCompanySchema  = Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().email().messages({'string.email':'email must be a valid email'}),
    phone: Joi.string(),
    address: Joi.string(),
    isActive: Joi.boolean().default(true)
});


const updateCompanyByIdSchema = Joi.object({
    name: Joi.string().trim(),
    email: Joi.string().email(),
    phone: Joi.string(),
    address: Joi.string(),
    isActive: Joi.boolean().default(true)  
})


export {addCompanySchema,
    updateCompanyByIdSchema};