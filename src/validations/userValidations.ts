import * as Joi from 'joi';

const regiseterSchema = Joi.object({
    username: Joi.string().required().trim(),
    password: Joi.string().required().trim().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/).messages({
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password must not exceed 30 characters',
    'string.pattern.base': 'Password must contain uppercase, lowercase, and a number',
    'any.required': 'Password is required'
  }),
    email: Joi.string().email().required()
});

export default regiseterSchema;
