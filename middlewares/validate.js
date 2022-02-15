const { is } = require("express/lib/request");
const httpStatus = require("http-status");
const Joi = require("joi");

const validate = (schema) => (req, res, next) => {

    try {
        const isValid = schema.validate(req.body);
        if (isValid.error != null) {
            const errorMessage = isValid.error.details.map(detail => detail.message).join(", ");
            //["","",""] 
            res.status(httpStatus.BAD_REQUEST).json({ error: errorMessage })
            return;
        }
        Object.assign(req, isValid.value);
        return next();
    } catch (err) {
        res.status(httpStatus.BAD_REQUEST).json({ error: err })
        return;
    }

};
module.exports = validate;