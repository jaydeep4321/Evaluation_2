const express = require("express");
const authController = require("../controller/authController");

const router = express.Router();

// router.post("/generate-secret", authController.generateSecret);

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.route("/logout").post(authController.logout);

// router.post("/verify-token/:id", authController.verifyToken);

module.exports = router;
