const express = require("express");
const quizController = require("../controller/quizController");

const router = express.Router();

router
  .route("/")
  .post(quizController.createQuiz)
  .get(quizController.getAllQuizzes);

router.route("/data").get(quizController.getAllQuizzes);

router
  .route("/:id")
  .get(quizController.getQuiz)
  .patch(quizController.updateQuiz)
  .delete(quizController.deleteQuiz);

module.exports = router;
