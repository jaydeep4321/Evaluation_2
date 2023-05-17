const Quiz = require("../model/quizModel");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/appError");
const glob = require("../../../utils/responseHandler");

//=================CREATE QUIZ===============//
exports.createQuiz = catchAsync(async (req, res, next) => {
  const quiz = new Quiz({
    title: req.body.title,
    description: req.body.description,
    duration: req.body.duration,
    questions: req.body.questions,
    createdBy: req.session.userId,
  });

  await quiz.save();

  quiz.active = undefined;
  quiz.createdAt = undefined;
  quiz.updatedAt = undefined;
  quiz.__v = undefined;

  glob.send(res, 201, "Quiz has been created!", quiz);
});

//=================GET ALL QUIZ==============//
exports.getAllQuizzes = catchAsync(async (req, res, next) => {
  const quizzes = await Quiz.find().populate("questions createdBy");

  glob.send(res, 200, "Quizzes found!", quizzes);
});

//=================GET QUIZ BY ID============//
exports.getQuiz = catchAsync(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id).populate(
    "questions createdBy"
  );

  if (!quiz) {
    return next(new AppError("Quiz not found", 404));
  }

  glob.send(res, 200, "Success", quiz);
});

//==================UPDATE==================//
exports.updateQuiz = catchAsync(async (req, res, next) => {
  const quiz = await Quiz.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      questions: req.body.questions,
    },
    { new: true }
  );

  if (!quiz) {
    return next(new AppError("Quiz not found", 404));
  }

  glob.send(res, 200, "Success", quiz);
});

//==================DELETE==================//
exports.deleteQuiz = catchAsync(async (req, res, next) => {
  const quiz = await Quiz.findByIdAndUpdate(req.params.id, {
    active: false,
    deletedAt: Date.now(),
  });

  if (!quiz) {
    return next(new AppError("Quiz not found", 404));
  }

  glob.send(res, 200, "Quiz deleted successfully");
});
