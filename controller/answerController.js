const Ans = require("../models/answerModel");
const Que = require("../models/questionModel");
const User = require("../models/userModel");

exports.postAnswer = async (req, res, next) => {
  try {
    const ans = new Ans({
      selectedOption: req.body.selectedOption,
      isCorrect: req.body.isCorrect,
      answerBy: req.params.id,
      score: req.body.score,
      questionId: req.body.questionId,
    });

    const question = await Que.findById(req.body.questionId);

    if (!question) {
      return next(new Error("you provided wrong question id", 400));
    }

    if (!(req.body.score === question.score)) {
      return next(new Error("you provided wrong score", 400));
    }

    let user = await User.findById(req.params.id);

    if (!user) {
      return next(new Error("user not found with this id", 400));
    }

    user = await User.findByIdAndUpdate(req.params.id, {
      $set: { totalScore: toatalScore + req.body.score },
    });
    // if (user.totalScore <= 0) {
    //   user.totalScore = req.body.score;
    // } else {
    //   user.totalScore = user.totalScore + req.body.score;
    // }

    await ans.save();
    res.status(201).json({ error: false, message: "success", data: ans });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};
