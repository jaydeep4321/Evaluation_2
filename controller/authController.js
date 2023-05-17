const speakeasy = require("speakeasy");
const User = require("../modules/user/models/userModel");
const bcrypt = require("bcrypt");
const qrcode = require("qrcode");
const catchAsync = require("../utils/catchAsync");
const glob = require("../utils/responseHandler");
const AppError = require("../utils/appError");
const session = require("express-session")
// const cookieParser = require("cookie-parser");
// app.use(cookieParser());

//=====================SIGN UP=========================//
// exports.signup = catchAsync(async (req, res, next) => {
//   const secretToken = speakeasy.generateSecret();

//   const user = new User({
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//     secret: secretToken.base32,
//   });

//   await user.save();
//   glob.send(res, 200, "success", secretToken.base32);
// });

//==================SIGN UP WITH QR==================//

exports.signup = catchAsync(async (req, res, next) => {
  const secretToken = speakeasy.generateSecret();

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    secret: secretToken.base32,
  });

  await user.save();

  // Generate QR code for user
  qrcode.toDataURL(secretToken.otpauth_url, (err, imageUrl) => {
    if (err) {
      console.log(err);
      return next(new AppError("Error generating QR code", 500));
    }

    res.status(200).json({
      error: false,
      message: "success",
      // token: secretToken.base32,
      qrCodeUrl: imageUrl,
    });
  });
});

//=====================LOGIN=====================//
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("Invalid email!", 400));
  }

  // Verify password
  const passwordIsValid = await bcrypt.compare(password, user.password);
  if (!passwordIsValid) {
    return next(new AppError("Invalid password!", 400));
  }

  req.session.cookie.maxAge = 60000;
  req.session.user = user;

  return glob.send(res, 200, "Cradential verified!", user);
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
      console.log(roles)
      console.log(user.role)
      return next(
        new AppError("You do not have a permission to perform this task.", 403)
      );
    }

    console.log("==>", "I am here")
    next();
  });
};

//=======================LOGOUT=======================//

exports.logout = catchAsync(async (req, res, next) => {
  // Destroy the session to log the user out
  req.session.destroy((err) => {
    if (err) throw err;

    return glob.send(res, 200, "Logout successful");
  });
});