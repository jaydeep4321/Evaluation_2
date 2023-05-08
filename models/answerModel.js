const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    selectedOption: {
      type: String,
    },
    isCorrect: {
      type: Boolean,
    },
    answerBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    score: {
      type: String,
    },
    questionId: {
      type: mongoose.Schema.ObjectId,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

// answerSchema.pre(/^find^/, function (next) {});
const Ans = mongoose.model("Ans", answerSchema);
module.exports = Ans;
