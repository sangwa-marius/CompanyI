import * as Joi from 'joi';


const addEmployeeSchema = Joi.object({
    names: Joi.string().trim().required().messages({
        'string.names':'names must be a string',
        'any.require':'names are required'}),
    email: Joi.string().email().required().trim().lowercase().messages({
        'string.email':'Invalid email format',
        'any.require':'Email is required'
    }),
    phone: Joi.string().optional().allow('').messages({
        'string.min':'phone number must be atleast 10 characters long',
        'string.max':'phone number must be atmost 13 characters long'
    }),
    company: Joi.string().required().trim(),
    department: Joi.string().trim().optional().allow(''),
    status: Joi.string().trim().valid('ACTIVE', 'INACTIVE', 'SUSPENDED').default('ACTIVE'),
    hiredAt: Joi.string().optional().allow('').messages({
        'string.base': 'Hire date must be a string'
    })
});



const updateEmployeeByIdSchema = Joi.object({
    names: Joi.string().trim().messages({
        'string.names':'names must be a string',
        'any.require':'names are required'}),
    email: Joi.string().email().trim().lowercase().messages({
        'string.email':'Invalid email format',
        'any.require':'Email is required'
    }),
    phone: Joi.string().optional().allow('').messages({
        'string.min':'phone number must be atleast 10 characters long',
        'string.max':'phone number must be atmost 13 characters long'
    }),
    company: Joi.string().trim(),
    department: Joi.string().trim().optional().allow(''),
    status: Joi.string().trim().valid('ACTIVE', 'INACTIVE', 'SUSPENDED'),
    hiredAt: Joi.string().optional().allow('').messages({
        'string.base': 'Hire date must be a string'
    })
});


export {addEmployeeSchema,
    updateEmployeeByIdSchema};