const Question = require("../models/questionModel");
const Quiz = require("../models/quizModel");

exports.createQuestion = async (req, res, next) => {
  try {
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

    res.status(201).json({
      error: false,
      message: "Question created successfully!",
      data: question,
    });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};

exports.getQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res
        .status(404)
        .json({ error: true, message: "Question not found" });
    }
    res.status(200).json({ error: false, data: question });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};

exports.updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res
        .status(404)
        .json({ error: true, message: "Question not found" });
    }

    question.questionText = req.body.questionText || question.questionText;
    question.options = req.body.options || question.options;

    await question.save();

    res.status(200).json({
      error: false,
      message: "Question updated successfully",
      data: question,
    });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res
        .status(404)
        .json({ error: true, message: "Question not found" });
    }

    await question.remove();

    res
      .status(200)
      .json({ error: false, message: "Question deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};
