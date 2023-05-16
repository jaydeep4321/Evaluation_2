const Joi = require("joi");
const constants = require("../../utils/constants");

const quizJoiSchema = Joi.object({
  title: Joi.string().required().max(50),
  description: Joi.string(),
  duration: Joi.number(),
  questions: Joi.array().items(Joi.string()),
  active: Joi.boolean(),
});

const validateQuiz = (req, res, next) => {
  const { error } = quizJoiSchema.validate(req.body, { abortEarly: false });
  if (error) {
    // const errorName = error.name;
    const message = error.details.map((err) => err.message);
    return res.status(400).json({ error: true, message });
  }
  next();
};

module.exports = validateQuiz;
