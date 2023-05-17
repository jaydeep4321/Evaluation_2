const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const catchAsync = require("../utils/catchAsync");
const glob = require("../utils/responseHandler");
const AppError = require("../utils/appError");
const User = require("../modules/user/model/userModel");

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
      qrCodeUrl: imageUrl,
    });
  });
});

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
