const catchAsync = require("../utils/catchAsync");
const User = require("../modules/user/models/userModel");
const speakeasy = require("speakeasy");
const glob = require("../utils/responseHandler");

exports.verifyOtp = catchAsync(async (req, res, next) => {
  const user = req.session.user; // Retrieve the user object from the session

  if (!user) {
    return glob.send(res, 403, "Session expired");
  }

  const secret = user.secret;
  const otp = req.body.otp;
  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: otp,
  });

  if (!verified) {
    return glob.send(res, 403, "Verification failed");
  }

  req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
  req.session.userId = user._id;

  // Clear sensitive user properties before sending the response
  user.password = undefined;
  user.secret = undefined;

  return glob.send(res, 200, "Verification successful", user);
});