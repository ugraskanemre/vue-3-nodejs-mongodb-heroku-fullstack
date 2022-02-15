const CryptoJs = require("crypto-js");
const JWT = require("jsonwebtoken");

const passwordToHash = (password) => {
    return CryptoJs.HmacSHA256(password, CryptoJs.MD5(password, process.env.PASSWORD_HASH_SECRET).toString()).toString();
};

const generateAccessToken = (user) => {
    return JWT.sign({ name: user.email, ...user }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: "1h" })
}
const generateRefreshToken = (user) => {
    return JWT.sign({ name: user.email, ...user }, process.env.REFRESH_TOKEN_SECRET_KEY)
}

module.exports = {
    passwordToHash,
    generateAccessToken,
    generateRefreshToken
}