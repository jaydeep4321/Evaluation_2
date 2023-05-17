const express = require("express");
const quizController = require("../controller/quizController");
const validateQuiz = require("../../../validation/quizValidation/quizValidator");
const validateUpdateQuiz = require("../../../validation/quizValidation/updateQuizValidation");
const authController = require("../../../controller/authController");

const router = express.Router();

//===============PROTECTED ROUTES FROM HERE================//

router.use(authController.protected);

router.route("/").get(quizController.getAllQuizzes);

router.route("/:id").get(quizController.getQuiz);

//================RESTRICTED ROUTES FROM HERE==============//

router.use(authController.restrictTo("admin", "superAdmin"));

router.route("/").post(validateQuiz, quizController.createQuiz);

router
  .route("/:id")
  .patch(validateUpdateQuiz, quizController.updateQuiz)
  .delete(quizController.deleteQuiz);

module.exports = router;
