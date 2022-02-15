const httpStatus = require("http-status");
const JWT = require("jsonwebtoken");

const authendicateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"] || null;
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.status(httpStatus.UNAUTHORIZED).send({ "error": "Giriş Yapmalısınız." });
    }

    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
        if (err) return res.status(httpStatus.FORBIDDEN).send({ "error": err })
        req.user = user;
        next();
    });


}

module.exports = authendicateToken;