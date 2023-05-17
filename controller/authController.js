const User = require("../modules/user/model/userModel");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const glob = require("../utils/responseHandler");
const AppError = require("../utils/appError");

//=====================LOGIN=====================//
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("Invalid email!", 400));
  }

  const passwordIsValid = await bcrypt.compare(password, user.password);
  if (!passwordIsValid) {
    return next(new AppError("Invalid password!", 400));
  }

  req.session.cookie.maxAge = 60000;
  // req.session.userId = user._id;
  req.session.user = user;

  return glob.send(res, 200, "Cradential verified!", null);
});

//==================ROUTE PROTECTION===============//
exports.protected = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: true, message: "Unauthorized" });
  }
  next();
};

//===================USER RESTRICTION====================//
exports.restrictTo = (...roles) => {
  // console.log("==>", ...roles);
  return catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.session.userId });
    console.log("==>", user);

    if (!roles.includes(user.role)) {
      console.log(roles);
      console.log(user.role);
      return next(
        new AppError("You do not have a permission to perform this task.", 403)
      );
    }

    console.log("==>", "I am here");
    next();
  });
};

//=======================LOGOUT=======================//

exports.logout = catchAsync(async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) throw err;

    return glob.send(res, 200, "Logout successful");
  });
});
