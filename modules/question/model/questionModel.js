const mongoose = require("mongoose");
const constant = require("../../../utils/constants");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: {
        values: [constant.QUESTION_TYPE_MCQ, constant.QUESTION_TYPE_TRUEFALSE],
        message: "{VALUE} is not supported",
      },

      required: true,
    },
    options: [
      {
        optionTitle: String,
        isCorrect: Boolean,
      },
    ],
    score: {
      type: Number,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: constant.QUIZ_MODEL,
    },
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

questionSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });

  next();
});

questionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "createdBy",
    select: "-__v -password -secret -active -role",
  });

  next();
});

const Question = mongoose.model(constant.QUESTION_MODEL, questionSchema);

module.exports = Question;
