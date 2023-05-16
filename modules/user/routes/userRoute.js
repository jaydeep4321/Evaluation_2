const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../../../controller/authController");
const verify = require("../../../auth/verifyCode");

const router = express.Router();

router.route("/signup").post(authController.signup);

router.route("/login").post(authController.login);

router.route("/verifyOtp").post(verify.verifyOtp);

router.route("/logout").post(authController.logout);

router.route("/leaderboard").get(userController.getLeaderBoard);

// router.route("/").get(authController.protected, userController.getAllUser);

router.route("/").get(userController.getAllUser);

module.exports = router;
