const Joi = require("joi");
const constants = require("../../utils/constants");

const userJoiSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const validateUser = (req, res, next) => {
  const { error } = userJoiSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((err) => err.message);
    return res.status(400).json({ error: true, message });
  }
  next();
};

module.exports = validateUser;
