const Question = require("../models/questionModel");
const Quiz = require("../models/quizModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

//==================CREATE==================//
exports.createQuestion = catchAsync(async (req, res, next) => {
  const question = new Question({
    text: req.body.text,
    type: req.body.type,
    options: req.body.options,
    score: req.body.score,
    quiz: req.params.id,
  });

  await question.save();
  const quiz = await Quiz.findById(req.params.id);
  quiz.questions.push(question);
  await quiz.save();

  glob.send(res, 201, "Question created successfully!", question);
});

//================GET QUESTION BY ID============//
exports.getQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    return next(new AppError("Question not found!", 404));
  }
  glob.send(res, 200, "Success", question);
});

//=================GET ALL QUESTION===============//
exports.getAllQuestions = catchAsync(async (req, res, next) => {
  const questions = await Question.find();

  if (!questions) {
    return next(new AppError("No questions available!", 404));
  }

  glob.send(res, 200, "Success", questions);
});

//===================UPDATE=================//
exports.updateQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    return next(new AppError("Question not found!", 404));
  }

  question.questionText = req.body.questionText || question.questionText;
  question.options = req.body.options || question.options;

  await question.save();

  glob.send(res, 200, "Question updated successfully", question);
});

//===================DELETE================//
exports.deleteQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndUpdate(req.params.id, {
    $set: { active: false },
  });
  if (!question) {
    return next(new AppError("Question not found!", 404));
  }

  glob.send(res, 200, "Question deleted successfully");
});