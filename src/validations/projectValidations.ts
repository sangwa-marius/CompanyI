import * as Joi from 'joi';

const addProjectSchema = Joi.object({
    name: Joi.string().required().trim(),
    company: Joi.string().required().trim(),
    manager: Joi.string().required().trim(),
    members: Joi.string().trim(),
    status: Joi.string().trim().default('PLANNED')
});

const updateProjectSchema = Joi.object({
    name: Joi.string().trim(),
    company: Joi.string().trim(),
    manager: Joi.string().trim(),
    members: Joi.string().trim(),
    status: Joi.string().trim().default('PLANNED')
})


export {addProjectSchema,
    updateProjectSchema};