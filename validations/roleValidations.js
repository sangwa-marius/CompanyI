const joi = requrie('joi');

const roleSchema = joi.object({
    name: joi.string().required().trim().uppercase(),
    permissions: joi.string().trim(),
    company: joi.string().required().trim()
})

module.exports = roleSchema;