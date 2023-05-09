const mongoose = require("mongoose");
const constant = require("../utils/constant");

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [constant.QUESTION_TYPE_MCQ, constant.QUESTION_TYPE_TRUEFALSE],
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
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
