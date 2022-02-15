const Mongoose = require("mongoose");


const TransactionSchema = new Mongoose.Schema({
    user_id: Mongoose.Schema.Types.ObjectId,
    side: String,

    fromExchangeSymbol: String,
    fromExchange: String,
    fromItemPrice: Number,
    fromQuantity: Number,

    toExchangeSymbol: String,
    toExchange: String,
    toItemPrice: Number,
    toQuantity: Number,

    comission: Number,
    comissionAmount: Number,

    totalAmount: Number,
    remainingAmount: Number



}, {
    versionKey: false,
    timestamps: true,

});

module.exports = Mongoose.model("transactions", TransactionSchema);