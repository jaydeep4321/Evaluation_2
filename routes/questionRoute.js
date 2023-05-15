const express = require("express");
const questionController = require("../controller/questionController");

const router = express.Router();

router.get("/", questionController.getAllQuestions);

router
  .route("/:id")
  .post(questionController.createQuestion)
  .get(questionController.getQuestion)
  .patch(questionController.updateQuestion)
  .delete(questionController.deleteQuestion);

module.exports = router;
