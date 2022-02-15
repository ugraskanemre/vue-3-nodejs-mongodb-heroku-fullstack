const Mongoose = require("mongoose");
const logger = require("../scripts/logger/User");


const UserSchema = new Mongoose.Schema({
    name: String,
    surname: String,
    email: {
        type: String,
        unique: true
    },
    password: String
}, {
    versionKey: false,
    timestamps: true,

});

UserSchema.post("save", (doc) => {
    logger.log({
        level: "info",
        message: doc
    });
});


module.exports = Mongoose.model("users", UserSchema);