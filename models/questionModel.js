const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["mcq", "trueFalse"],
    required: true,
  },
  options: [
    {
      optionText: String,
      isCorrect: Boolean,
    },
  ],
  score: {
    type: Number,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
