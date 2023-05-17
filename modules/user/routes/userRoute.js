const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../../../controller/authController");
const signupValidator = require("../../../validation/userValidation/signupValidator")
const loginValidator = require("../../../validation/userValidation/loginValidator")
const verify = require("../../../auth/verifyCode");

const router = express.Router();

router.route("/signup").post(signupValidator, authController.signup);
router.route("/login").post(loginValidator, authController.login);
router.route("/verifyOtp").post(verify.verifyOtp);
router.route("/logout").post(authController.logout);


//===============PROTECTED ROUTES FROM HERE================//

router.use(authController.protected)

router.route("/leaderboard").get(userController.getLeaderBoard);
router.route("/").get(userController.getAllUser);

module.exports = router;
