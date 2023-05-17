const express = require("express");
const questionController = require("../controller/questionController");
const authController = require("../../../controller/authController");
const validateQuestion = require("../../../validation/questionValidation/questionvalidator");

const router = express.Router();

//===============PROTECTED ROUTES FROM HERE================//

router.use(authController.protected);

router.get("/", questionController.getAllQuestions);
router.get("/:id", questionController.getQuestion);

//================RESTRICTED ROUTES FROM HERE==============//

router.use(authController.restrictTo("admin", "superAdmin"));

router
  .route("/:id")
  .post(validateQuestion, questionController.createQuestion)
  .patch(questionController.updateQuestion)
  .delete(questionController.deleteQuestion);

router.route("/:id/addToQuiz").patch(questionController.addQuestionById);

module.exports = router;
