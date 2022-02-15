const Ticker = require("../models/ticker");
const Transaction = require("../models/transaction");


const list = () => {
    return Ticker.find({});
}

const transaction = (req) => {
    const user_id = req?.user?._doc?._id;
    const transaction = new Transaction({ ...req.body, user_id });
    return transaction.save();
}

module.exports = {
    list,
    transaction
}