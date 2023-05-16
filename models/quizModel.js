const mongoose = require("mongoose");
const constant = require("../utils/constants");

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    duration: {
      type: Number,
      default: 0,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: constant.QUESTION_MODEL,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: constant.USER_MODEL,
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
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

quizSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });

  next();
});

const Quiz = mongoose.model(constant.QUIZ_MODEL, quizSchema);

module.exports = Quiz;
