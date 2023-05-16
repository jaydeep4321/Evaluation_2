const speakeasy = require("speakeasy");
const User = require("../modules/user/models/userModel");
const bcrypt = require("bcrypt");
const qrcode = require("qrcode");
const catchAsync = require("../utils/catchAsync");
const glob = require("../utils/responseHandler");
const AppError = require("../utils/appError");
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

  return glob.send(res, 200, "Cradential verified!", user);
});

// exports.login = catchAsync(async (req, res, next) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });

//   if (!user) {
//     return next(new AppError("Invalid email!", 400));
//   }

//   // Verify password
//   const passwordIsValid = await bcrypt.compare(password, user.password);
//   if (!passwordIsValid) {
//     return next(new AppError("Invalid password!", 400));
//   }

//   // Verify TOTP token
//   const secret = user.secret;
//   const token = req.body.token;
//   const verified = speakeasy.totp.verify({
//     secret: secret,
//     encoding: "base32",
//     token: token,
//   });

//   if (!verified) {
//     return res.status(403).json({
//       error: true,
//       message: "verification failed",
//     });
//   }

//   // Set session data to indicate that the user is authenticated
//   req.session.userId = user._id;
//   // res.cookie('session_id', req.session.userId);

//   return res.status(200).json({
//     status: "success",
//     message: "verification successful",
//     data: user,
//   });
// });

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
      return next(
        new AppError("You do not have a permission to perform this task.", 403)
      );
    }
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

// exports.logout = catchAsync(async (req, res, next) => {
//   // Destroy the session to log the user out
//   req.session.destroy((err) => {
//     if (err) throw err;

//     return res.status(200).json({
//       status: "success",
//       message: "logout successful",
//     });
//   });
// });
