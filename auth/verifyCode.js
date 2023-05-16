const catchAsync = require("../utils/catchAsync");
const User = require("../modules/user/models/userModel");
const speakeasy = require("speakeasy");
const glob = require("../utils/responseHandler");

exports.verifyOtp = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
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

  // Set session data to indicate that the user is authenticated
  req.session.userId = user._id;

  user.password = undefined;
  user.secret = undefined;
  return glob.send(res, 200, "Verification successful", user);
});
