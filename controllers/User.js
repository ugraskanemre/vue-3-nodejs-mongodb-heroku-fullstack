const { response } = require("express");
const httpStatus = require("http-status");
const { insert, loginUser, list, modify, checkEmail } = require("../services/user");
const { passwordToHash, generateAccessToken, generateRefreshToken } = require("../scripts/utils/helper");
const { v4: uuidv4 } = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");

const index = (req, res) => {
    list().then(response => {
        res.status(httpStatus.OK).send(response)
    }).catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR));
}

const signup = (req, res) => {
    req.body.password = passwordToHash(req.body.password);
    insert(req.body).then((response) => {
        if (response == null) return res.status(httpStatus.NOT_FOUND).send({ "message": "This e-mail address has already been taken" })
        res.status(httpStatus.CREATED).send(response);
    }).catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
}

const login = async(req, res) => {
    req.body.password = passwordToHash(req.body.password);
    return loginUser(req.body)
        .then((user) => {
            if (!user) return res.status(httpStatus.NOT_FOUND).send({ "message": "User not found." })

            user = {
                ...user.toObject(),
                tokens: {
                    access_token: generateAccessToken(user),
                    refresh_token: generateRefreshToken(user)
                }
            }

            delete user.password;
            res.status(httpStatus.OK).send(user)
        })
        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
}


const resetPassword = (req, res) => {

    const new_password = uuidv4().toString().split("-")[0].toString();

    modify({
        email: req.body.email
    }, {
        password: passwordToHash(new_password)
    }).then((updatedUser) => {
        if (!updatedUser) return res.status(httpStatus.NOT_FOUND).send({ "error": "User not found." });
        eventEmitter.emit("send_email", {
            to: updatedUser.email,
            subject: "Reset Password",
            html: `<p>Your password process according to your request.</p> 
                   <p> Do not forget to change your password after logging into the system. </p>
                   <p> New Password: <b>${new_password}</b> </p>
                   `
        });
        res.status(httpStatus.OK).send({ "message": "Your password has been successfully reset, your new password has been sent to you." });
        //See to Preview URL https://ethereal.email/message/YgFh3kN2S91NBU3PYgFh3wrgaBfSTpG0AAAAARjxXDyBwuFD1CUXkuvgbmw

    }).catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ "error": e }));
}

const checkUserEmail = (req, res) => {
    checkEmail({
        email: req.params.email
    }).then((user) => {
        if (user == null) return res.status(httpStatus.OK).send({ "status": true });
        res.status(httpStatus.OK).send({ "status": false });

    }).catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ "error": e }));
}


module.exports = {
    index,
    signup,
    login,
    resetPassword,
    checkUserEmail

}