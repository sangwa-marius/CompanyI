import * as Joi from 'joi';

const addProjectSchema = Joi.object({
    name: Joi.string().required().trim(),
    company: Joi.string().required().trim(),
    description: Joi.string().trim(),
    manager: Joi.string().trim().optional(),
    members: Joi.array().items(Joi.string()).single().optional(),
    status: Joi.string().trim().valid('PLANNED', 'ONGOING', 'COMPLETED').default('PLANNED')
});

const updateProjectSchema = Joi.object({
    name: Joi.string().trim(),
    company: Joi.string().trim(),
    manager: Joi.string().trim().optional(),
    members: Joi.array().items(Joi.string()).single().optional(),
    status: Joi.string().trim().valid('PLANNED', 'ONGOING', 'COMPLETED')
})


export {addProjectSchema,
    updateProjectSchema};