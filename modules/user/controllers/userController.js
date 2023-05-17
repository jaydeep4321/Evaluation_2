const User = require("../models/userModel");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/appError");
const glob = require("../../../utils/responseHandler");

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
  const users = await User.find()
    .sort({ totalScore: -1 })
    .select("name email totalScore");

  if (!users) {
    return next(new AppError("There is no user!", 404));
  }

  glob.send(res, 200, "Success", users);
});