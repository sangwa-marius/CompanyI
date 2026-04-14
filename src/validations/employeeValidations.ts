import * as Joi from 'joi';


const addEmployeeSchema = Joi.object({
    names: Joi.string().trim().required().messages({
        'string.names':'names must be a string',
        'any.require':'names are required'}),
    email: Joi.string().email().required().trim().lowercase().messages({
        'string.email':'Invalid email format',
        'any.require':'Email is required'
    }),
    phone: Joi.string().min(10).max(13).messages({
        'string.min':'phone number must be atleast 10 characters long',
        'string.max':'phone number must be atmost 13 characters long'
    }),
    company: Joi.string().required().trim(),
    department: Joi.string().required().trim(),
    role: Joi.string().trim().default('ACTIVE'),
    hiredAt: Joi.date().iso().min('2020-12-31').max('now')
});



const updateEmployeeByIdSchema = Joi.object({
    names: Joi.string().trim().messages({
        'string.names':'names must be a string',
        'any.require':'names are required'}),
    email: Joi.string().email().trim().lowercase().messages({
        'string.email':'Invalid email format',
        'any.require':'Email is required'
    }),
    phone: Joi.string().min(10).max(13).messages({
        'string.min':'phone number must be atleast 10 characters long',
        'string.max':'phone number must be atmost 13 characters long'
    }),
    company: Joi.string().trim(),
    department: Joi.string().trim(),
    role: Joi.string().trim().default('ACTIVE'),
    hiredAt: Joi.date().iso().min('2020-12-31').max('now')
});


export {addEmployeeSchema,
    updateEmployeeByIdSchema};