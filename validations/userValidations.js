const joi = require('joi');

const regiseterSchema = joi.object({
    username: joi.string().required().trim(),
    password: joi.string().required().trim().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/).messages({
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password must not exceed 30 characters',
    'string.pattern.base': 'Password must contain uppercase, lowercase, and a number',
    'any.required': 'Password is required'
  }),
    email: joi.string().email().required()
});

module.exports = regiseterSchema;
