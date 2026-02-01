const joi = require('joi');

const addProjectSchema = joi.object({
    name: joi.string().required().trim(),
    company: joi.string().required().trim(),
    manager: joi.string().required().trim(),
    members: joi.string().trim(),
    status: joi.string().trim().default('PLANNED')
});

const updateProjectSchema = joi.object({
    name: joi.string().trim(),
    company: joi.string().trim(),
    manager: joi.string().trim(),
    members: joi.string().trim(),
    status: joi.string().trim().default('PLANNED')
})


module.exports = {
    addProjectSchema,
    updateProjectSchema
}