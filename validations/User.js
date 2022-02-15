const Joi = require("joi");

const createValidation = Joi.object({
    name: Joi.string().required().min(3),
    surname: Joi.string().required().min(2),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
});

const loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
});

const resetPasswordValidation = Joi.object({
    email: Joi.string().email().required(),
});


module.exports = {
    createValidation,
    loginValidation,
    resetPasswordValidation
}