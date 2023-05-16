const express = require("express");
const quizController = require("../controller/quizController");
const validateQuiz = require("../validation/quizValidation/quizValidator");
const authController = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .post(validateQuiz, quizController.createQuiz)
  .get(quizController.getAllQuizzes);

router.route("/data").get(quizController.getAllQuizzes);

router
  .route("/:id")
  .get(quizController.getQuiz)
  .patch(quizController.updateQuiz)
  .delete(
    authController.protected,
    authController.restrictTo("admin"),
    quizController.deleteQuiz
  );

module.exports = router;
