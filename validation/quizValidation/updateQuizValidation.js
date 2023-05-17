const Joi = require("joi");

const quizJoiSchema = Joi.object({
  title: Joi.string().max(50),
  description: Joi.string(),
  duration: Joi.number(),
});

const validateUpdateQuiz = (req, res, next) => {
  const { error } = quizJoiSchema.validate(req.body, { abortEarly: false });
  if (error) {
    // const errorName = error.name;
    const message = error.details.map((err) => err.message);
    return res.status(400).json({ error: true, message });
  }
  next();
};

module.exports = validateUpdateQuiz;
