const Token = require("../models/tokenModel");
const speakeasy = require("speakeasy");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.generateSecret = async (req, res, next) => {
  const secretToken = speakeasy.generateSecret();
  try {
    const token = await Token.create({ secret: secretToken.base32 });
    return res.status(201).json({
      status: "success",
      message: "secret token generated",
      token: secretToken.base32,
      tokenId: token.id,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.message || "something went wrong",
    });
  }
};

exports.signup = async (req, res, next) => {
  const secretToken = speakeasy.generateSecret();
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      secret: secretToken.base32,
    });

    await user.save();

    res
      .status(200)
      .json({ error: false, message: "success", token: secretToken.base32 });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: true, message: error.message });
  }
};

exports.verifyToken = async (req, res, next) => {
  const secretToken = await Token.findById(req.params.id);
  const enteredToken = req.body.token;

  console.log(secretToken);
  console.log(secretToken.secret);

  const verified = speakeasy.totp.verify({
    secret: secretToken.secret,
    encoding: "base32",
    token: enteredToken,
  });
  if (!verified) {
    return res.status(403).json({
      message: "verification failed",
    });
  }
  secretToken.authIsSet = true;
  console.log(secretToken.authIsSet);

  return res.status(200).json({
    status: "success",
    message: "verification successful",
    verified: verified,
  });
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, token } = req.body;
    const user = await User.find({ email });

    // console.log(user.toObject());
    console.log("==>", user.secret);

    if (!user) {
      return next(new Error("Invalid email!", 400));
    }

    console.log("at compare");
    // if (!(await bcrypt.compare(password, user.password))) {
    //   return next(new AppError("Invalid password!", 401));
    // }

    console.log("at verification");
    // await bcrypt.compare(password, user.password);
    const verified = speakeasy.totp.verify({
      secret: user.secret,
      encoding: "base32",
      token: req.body.token,
    });
    if (!verified) {
      return res.status(403).json({
        message: "verification failed",
      });
    }
    user.authIsSet = true;
    console.log(user.authIsSet);

    return res.status(200).json({
      status: "success",
      message: "verification successful",
      verified: verified,
    });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};
