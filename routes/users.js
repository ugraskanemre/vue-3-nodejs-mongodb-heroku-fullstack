var express = require('express');
const { index, signup, login, resetPassword, checkUserEmail } = require("../controllers/User");
const router = express.Router();
const validate = require("../middlewares/validate");
const schemas = require("../validations/User");
const authendicate = require("../middlewares/authendicate");


router.route("/").get(authendicate, index);
router.route("/signup").post(validate(schemas.createValidation), signup);
router.route("/login").post(validate(schemas.loginValidation), login);
router.route("/reset-password").post(validate(schemas.resetPasswordValidation), resetPassword);
router.route("/check-email/:email").get(checkUserEmail);

module.exports = router;