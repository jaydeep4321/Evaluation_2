const Que = require("../models/questionModel");

exports.createQuestion = async (req, res, next) => {
  try {
    const question = new Que({
      number: req.body.number,
      type: req.body.type,
      text: req.body.text,
      answerOption: req.body.answerOption,
      score: req.body.score,
    });

    await question.save();

    res
      .status(201)
      .json({ error: false, message: "created successfully!", data: question });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};
