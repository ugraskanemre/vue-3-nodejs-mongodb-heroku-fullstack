var express = require('express');
const { index, order } = require("../controllers/Ticker");
const router = express.Router();
const validate = require("../middlewares/validate");
const schemas = require("../validations/Ticker");
const authendicate = require("../middlewares/authendicate");


router.route("/").get(authendicate, index);
router.route("/order").post(authendicate, validate(schemas.orderTransactionValidation), order);

module.exports = router;