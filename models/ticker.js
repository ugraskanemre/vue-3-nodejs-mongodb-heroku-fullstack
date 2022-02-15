const Mongoose = require("mongoose");


const TickersSchema = new Mongoose.Schema({
    title: String,
    icon: String,
    symbol: String,
    price: Number
}, {
    versionKey: false,
    timestamps: true,

});

module.exports = Mongoose.model("tickers", TickersSchema);