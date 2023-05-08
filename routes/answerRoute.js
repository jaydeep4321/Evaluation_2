const express = require("express");
const answerController = require("../controller/answerController");

const router = express.Router();

router.route("/:id").post(answerController.postAnswer);

module.exports = router;
