const express = require("express");
const userController = require("../controller/userController");
const authController = require("../controller/authController");

const router = express.Router();

router.route("/signup").post(userController.signup);

router.route("/").get(authController.protected, userController.getAllUser);

module.exports = router;
