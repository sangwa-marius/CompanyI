import * as Joi from 'joi';

const addRoleSchema = Joi.object({
    name: Joi.string().required().trim().uppercase(),
    permissions: Joi.string().trim(),
    company: Joi.string().required().trim()
})

const updateRoleSchema = Joi.object({
    name: Joi.string().trim().uppercase(),
    permissions: Joi.string().trim(),
    company: Joi.string().trim()
})

export {addRoleSchema,
    updateRoleSchema};