const { response } = require("express");
const httpStatus = require("http-status");
const { list, transaction } = require("../services/ticker");

const index = (req, res) => {
    list().then(response => {
        res.status(httpStatus.OK).send(response)
    }).catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR));

}

const order = (req, res) => {
    transaction(req).then(response => {
        res.status(httpStatus.CREATED).send(response);
    }).catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
}

module.exports = {
    index,
    order
}