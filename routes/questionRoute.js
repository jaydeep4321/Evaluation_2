const express = require("express");
const questionController = require("../controller/questionController");

const router = express.Router();

router.route("/").post(questionController.createQuestion);

module.exports = router;
