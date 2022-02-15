const Joi = require("joi");

const orderTransactionValidation = Joi.object({
    side: Joi.string().required().min(3),
    fromExchangeSymbol: Joi.string().required().min(3),
    fromExchange: Joi.string().required().min(3),
    fromItemPrice: Joi.number().required(),
    fromQuantity: Joi.number().required(),


    toExchangeSymbol: Joi.string().required().min(3),
    toExchange: Joi.string().required().min(3),
    toItemPrice: Joi.number().required(),
    toQuantity: Joi.number().required(),

    comission: Joi.number().required(),
    comissionAmount: Joi.number().required(),

    totalAmount: Joi.number().required(),
    remainingAmount: Joi.number().required(),
});


module.exports = {
    orderTransactionValidation,
}