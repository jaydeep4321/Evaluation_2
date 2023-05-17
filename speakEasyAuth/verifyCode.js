const catchAsync = require("../utils/catchAsync");
const User = require("../modules/user/model/userModel");
const speakeasy = require("speakeasy");
const glob = require("../utils/responseHandler");

exports.verifyOtp = catchAsync(async (req, res, next) => {
  const user = req.session.user;

  if (!user) {
    return glob.send(res, 403, "Session expired");
  }

  const secret = user.secret;
  const totp = req.body.totp;
  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: totp,
  });

  if (!verified) {
    return glob.send(res, 403, "Verification failed");
  }

  req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
  req.session.userId = user._id;

  user.password = undefined;
  user.secret = undefined;
  user.role = undefined;
  user.active = undefined;
  user.createdAt = undefined;
  user.updatedAt = undefined;
  user.__v = undefined;

  return glob.send(res, 200, "Verification successful", user);
});
