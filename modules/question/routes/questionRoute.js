const express = require("express");
const questionController = require("../controllers/questionController");
const validateQuestion = require("../../../validation/questionValidation/questionvalidator");

const router = express.Router();

router.get("/", questionController.getAllQuestions);

router
  .route("/:id")
  .post(validateQuestion, questionController.createQuestion)
  .get(questionController.getQuestion)
  .patch(questionController.updateQuestion)
  .delete(questionController.deleteQuestion);

module.exports = router;
