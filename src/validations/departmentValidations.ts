import * as Joi from 'joi';

const addDepartmentSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name cannot be empty',
        'any.required': 'Name is required'
    }),

    company: Joi.string().trim().required().messages({
        'string.base': 'Company must be a string',
        'string.empty': 'Company cannot be empty',
        'any.required': 'Company is required'
    }),

    manager: Joi.string().trim().required().messages({
        'string.base': 'Manager must be a string',
        'string.empty': 'Manager cannot be empty',
        'any.required': 'Manager is required'
    })
});

const updateDepartmentByIdSchema = Joi.object({
    name: Joi.string().trim().messages({
        'string.base': 'Name must be a string'
    }),
    company: Joi.string().trim().messages({
        'string.base': 'Company must be a string'
    }),
    manager: Joi.string().trim().messages({
        'string.base': 'Manager must be a string'
    })
}).min(1);

export {updateDepartmentByIdSchema,
    addDepartmentSchema};
