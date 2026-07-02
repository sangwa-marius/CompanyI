const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { stripUnknown: true, abortEarly: false });
        if (error) {
            return res.status(400).json({
                message: "Validation Error",
                errors: error.details.map(detail => detail.message)
            });
        }
        req.body = value;
        next();
    };
}


export default validate;