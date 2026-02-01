const joi = require('joi');

const addDepartmentSchema = joi.object({
    name: joi.string().required().trim(),
    company: joi.string().required().trim(),
    manager: joi.string().required().trim()
});

const updateDepartmentByIdSchema = joi.object({
    name: joi.string().trim(),
    company: joi.string().trim(),
    manager: joi.string().trim()
})


module.exports ={
    updateDepartmentByIdSchema,
    addDepartmentSchema
}