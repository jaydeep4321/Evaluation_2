const { Socket } = require("socket.io");
const Quiz = require("../models/quizModel");

exports.createQuiz = async (req, res, next) => {
  try {
    const quiz = new Quiz({
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      questions: req.body.questions,
    });

    await quiz.save();

    res
      .status(201)
      .json({ error: false, message: "Quiz has been created!", data: quiz });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};

exports.getAllQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find();

    // const socket = req.app.get("socket");
    // socket.emit("quiz", quizzes);
    // global.io.emit("news", { hello: "world" });
    res
      .status(200)
      .json({ error: false, message: "Quizzes found!", data: quizzes });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};

exports.getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ error: true, message: "Quiz not found" });
    }

    res.status(200).json({ error: false, data: quiz });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};

exports.updateQuiz = async (req, res, next) => {
  try {
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
      return res.status(404).json({ error: true, message: "Quiz not found" });
    }

    res.status(200).json({ error: false, data: quiz });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};

exports.deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, {
      $set: { active: false },
    });

    if (!quiz) {
      return res.status(404).json({ error: true, message: "Quiz not found" });
    }

    res
      .status(200)
      .json({ error: false, message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};
