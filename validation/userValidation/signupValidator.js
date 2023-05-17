const Joi = require("joi");
const constants = require("../../utils/constants");

const userJoiSchema = Joi.object({
  name: Joi.string().required().max(50),
  email: Joi.string().email().required(),

  role: Joi.string().valid(
    constants.USER_ROLE_USER,
    constants.USER_ROLE_ADMIN,
    constants.USER_ROLE_SUPERADMIN
  ),
  password: Joi.string().min(8).max(12).required(),
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
