const User = require("../models/userModel");

exports.signup = async (req, res, next) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    await user.save();

    res
      .status(201)
      .json({ error: false, message: "created succefully", data: user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: true, message: error.message });
  }
};

exports.getAllUser = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users) {
      return next(new Error("There is no user!", 404));
    }

    res.status(400).json({ error: false, message: "success", data: users });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: true, message: error.message });
  }
};

exports.getLeaderBoard = async (req, res) => {
  const users = await User.find().sort({ totalScore: -1 });
  
  if (!users) {
    return next(new Error("There is no user!", 404));
  }
  res.status(400).json({ error: false, message: "success", data: users });
};