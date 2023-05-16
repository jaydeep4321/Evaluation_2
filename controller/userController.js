const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

//====================GET ALL USER=================//
exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();

  if (!users) {
    return next(new AppError("There is no user!", 404));
  }

  glob.send(res, 200, "Success", users);
});

//====================LEADERBOARD============//
exports.getLeaderBoard = catchAsync(async (req, res, next) => {
  const users = await User.find().sort({ totalScore: -1 });

  if (!users) {
    return next(new AppError("There is no user!", 404));
  }

  glob.send(res, 200, "Success", users);
});


//================JUST FOR REFRENCE =================//
// exports.signup = async (req, res, next) => {
//   try {
//     const user = new User({
//       name: req.body.name,
//       email: req.body.email,
//       password: req.body.password,
//     });

//     await user.save();

//     res
//       .status(201)
//       .json({ error: false, message: "created succefully", data: user });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ error: true, message: error.message });
//   }
// };
