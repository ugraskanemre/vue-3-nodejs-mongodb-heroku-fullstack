const User = require("../models/user");

const insert = async(userData) => {
    const userCheck = await User.findOne({ email: userData.email });
    if (userCheck == null) {
        const user = new User(userData);
        return user.save();
    }
    return;
}

const loginUser = (loginData) => {
    return User.findOne(loginData);
}

const checkEmail = (userData) => {
    return User.findOne({ email: userData.email });
}

const list = () => {
    return User.find({});
}

const modify = (where, data) => {
    return User.findOneAndUpdate(where, data, { new: true });
}

module.exports = {
    insert,
    loginUser,
    list,
    modify,
    checkEmail
}