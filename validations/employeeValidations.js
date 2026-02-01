const joi = require('joi');


const addEmployeeSchema = joi.object({
    names: joi.string().trim().required().messages({'string.names':'names must be a string','any.require':'names are required'}),
    email: joi.string().email().required().trim().lowercase().messages({
        'string.email':'Invalid email format',
        'any.require':'Email is required'
    }),
    phone: joi.string().min(10).max(13).messages({
        'string.min':'phone number must be atleast 10 characters long',
        'string.max':'phone number must be atmost 13 characters long'
    }),
    company: joi.string().required().trim(),
    department: joi.string().required().trim(),
    role: joi.string().trim().default('ACTIVE'),
    hiredAt: joi.date().iso().min('2020-12-31').max('now')
});



const updateEmployeeByIdSchema = joi.object({
    names: joi.string().trim().messages({'string.names':'names must be a string','any.require':'names are required'}),
    email: joi.string().email().trim().lowercase().messages({
        'string.email':'Invalid email format',
        'any.require':'Email is required'
    }),
    phone: joi.string().min(10).max(13).messages({
        'string.min':'phone number must be atleast 10 characters long',
        'string.max':'phone number must be atmost 13 characters long'
    }),
    company: joi.string().trim(),
    department: joi.string().trim(),
    role: joi.string().trim().default('ACTIVE'),
    hiredAt: joi.date().iso().min('2020-12-31').max('now')
});


module.exports = {
    addEmployeeSchema,
    updateEmployeeByIdSchema
}