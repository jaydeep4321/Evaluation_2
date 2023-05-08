const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      require: true,
    },
    type: {
      type: String,
      enum: ["true-false", "mcq", "yes-no"],
      require: true,
    },
    text: {
      type: String,
      min: 10,
      max: 100,
    },
    answerOption: {
      type: [String],
      max: 4,
    },
    score: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const Que = mongoose.model("Que", questionSchema);
module.exports = Que;
