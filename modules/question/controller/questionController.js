const Question = require("../model/questionModel");
const Quiz = require("../../quiz/model/quizModel");
const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");
const glob = require("../../../utils/responseHandler");

//==================CREATE==================//
exports.createQuestion = catchAsync(async (req, res, next) => {
  const question = new Question({
    title: req.body.title,
    type: req.body.type,
    options: req.body.options,
    score: req.body.score,
    quiz: req.params.id,
    createdBy: req.session.userId,
  });

  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    return next(new AppError("Quiz id not found", 404));
  }
  await question.save();
  quiz.questions.push(question);
  await quiz.save();

  question.active = undefined;
  question.createdAt = undefined;
  question.updatedAt = undefined;
  question.__v = undefined;

  glob.send(res, 201, "Question created successfully!", question);
});

//================GET QUESTION BY ID============//
exports.getQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findById(req.params.id).populate({
    path: "quiz",
    select: "title",
  });
  if (!question) {
    return next(new AppError("Question not found!", 404));
  }
  glob.send(res, 200, "Success", question);
});

//=================GET ALL QUESTION===============//
exports.getAllQuestions = catchAsync(async (req, res, next) => {
  const questions = await Question.find().populate({
    path: "quiz",
    select: "title",
  });

  if (!questions) {
    return next(new AppError("No questions available!", 404));
  }

  glob.send(res, 200, "Success", questions);
});

//===================UPDATE=================//
exports.updateQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      type: req.body.type,
      options: req.body.options,
      score: req.body.score,
      quiz: req.params.id,
    },
    { new: true }
  );

  if (!question) {
    return next(new AppError("Question not found!", 404));
  }

  glob.send(res, 200, "Question updated successfully", question);
});

//===================DELETE================//
exports.deleteQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndUpdate(req.params.id, {
    active: false,
    deletedAt: Date.now(),
  });

  console.log("==>", question.quiz);
  let quiz = await Quiz.findById(question.quiz);
  console.log("==> question_id", question._id);
  // quiz.questions.pop(question._id);
  // console.log("==> quiz_questions", quiz.questions);
  quiz.questions = quiz.questions.remove(question._id);
  console.log(quiz.questions);

  quiz = await Quiz.findByIdAndUpdate(question.quiz, {
    $set: { questions: quiz.questions },
  });
  console.log("==>", quiz);
  if (!question) {
    return next(new AppError("Question not found!", 404));
  }

  glob.send(res, 200, "Question deleted successfully");
});

exports.addQuestionById = catchAsync(async (req, res, next) => {
  let question = await Question.findById(req.params.id);

  if (!question) {
    return next(new AppError("Question not found", 404));
  }

  let quiz = await Quiz.findById(req.body.quiz);

  if (!quiz) {
    return next(new AppError("Quiz not found", 404));
  }

  quiz.questions = quiz.questions.push(question._id);

  quiz = await Quiz.findByIdAndUpdate(req.body.quiz, {
    $set: { questions: quiz.questions },
  });

  question = await Question.findByIdAndUpdate(req.params.id, {
    $set: { quiz: req.body.quiz },
  });

  return glob.send(res, 200, "Added successfully!", question);
});
