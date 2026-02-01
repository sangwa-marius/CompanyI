const joi = require('joi');

const addDepartmentSchema = joi.object({
    name: joi.string().required().trim(),
    company: joi.string().required().trim(),
    manager: joi.string().required().trim()
});

const updateDepartmentByIdSchema = joi.object({
    name: joi.string().required(),
    company: joi.string().required(),
    manager: joi.string()
})


module.exports ={
    updateDepartmentByIdSchema,
    addDepartmentSchema
}