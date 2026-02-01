const joi = require('joi');

const addRoleSchema = joi.object({
    name: joi.string().required().trim().uppercase(),
    permissions: joi.string().trim(),
    company: joi.string().required().trim()
})

const updateRoleSchema = joi.object({
    name: joi.string().trim().uppercase(),
    permissions: joi.string().trim(),
    company: joi.string().trim()
})

module.exports = {
    addRoleSchema,
    updateRoleSchema
}