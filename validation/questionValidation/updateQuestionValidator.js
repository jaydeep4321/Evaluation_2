const Joi = require("joi");
const constants = require("../../utils/constants");

const questionJoiSchema = Joi.object({
  title: Joi.string().max(100),
  type: Joi.string()
    .valid(constants.QUESTION_TYPE_MCQ, constants.QUESTION_TYPE_TRUEFALSE),
  options: Joi.array()
    .items(Joi.object({ optionTitle: Joi.string(), isCorrect: Joi.boolean() }))
    .max(4),
  score: Joi.number(),
  quiz: Joi.string(),
});

const validateQuestion = (req, res, next) => {
  const { error } = questionJoiSchema.validate(req.body, { abortEarly: false });
  if (error) {
    // const errorName = error.name;
    const message = error.details.map((err) => err.message);
    return res.status(400).json({ error: true, message });
  }
  next();
};

module.exports = validateQuestion;