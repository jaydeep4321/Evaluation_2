const Token = require("../models/tokenModel");
const speakeasy = require("speakeasy");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const qrcode = require("qrcode");

// exports.generateSecret = async (req, res, next) => {
//   const secretToken = speakeasy.generateSecret();
//   try {
//     const token = await Token.create({ secret: secretToken.base32 });
//     return res.status(201).json({
//       status: "success",
//       message: "secret token generated",
//       token: secretToken.base32,
//       tokenId: token.id,
//     });
//   } catch (error) {
//     return res.status(400).json({
//       error: true,
//       message: error.message || "something went wrong",
//     });
//   }
// };

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

// exports.signup = async (req, res, next) => {
//   const secretToken = speakeasy.generateSecret();
//   try {
//     const user = new User({
//       name: req.body.name,
//       email: req.body.email,
//       password: req.body.password,
//       secret: secretToken.base32,
//     });

//     await user.save();

//     // Generate QR code for user
//     qrcode.toDataURL(secretToken.otpauth_url, (err, imageUrl) => {
//       if (err) {
//         console.log(err);
//         return res
//           .status(500)
//           .json({ error: true, message: "Error generating QR code" });
//       }

//       res.status(200).json({
//         error: false,
//         message: "success",
//         token: secretToken.base32,
//         qrCodeImageUrl: imageUrl,
//       });
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ error: true, message: error.message });
//   }
// };

// exports.verifyToken = async (req, res, next) => {
//   const secretToken = await Token.findById(req.params.id);
//   const enteredToken = req.body.token;

//   console.log(secretToken);
//   console.log(secretToken.secret);

//   const verified = speakeasy.totp.verify({
//     secret: secretToken.secret,
//     encoding: "base32",
//     token: enteredToken,
//   });
//   if (!verified) {
//     return res.status(403).json({
//       message: "verification failed",
//     });
//   }
//   secretToken.authIsSet = true;
//   console.log(secretToken.authIsSet);

//   return res.status(200).json({
//     status: "success",
//     message: "verification successful",
//     verified: verified,
//   });
// };

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(new Error("Invalid email!", 400));
    }

    // Verify password
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return next(new Error("Invalid password!", 400));
    }

    // Verify TOTP token
    const secret = user.secret;
    const token = req.body.token;
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: token,
    });

    if (!verified) {
      return res.status(403).json({
        message: "verification failed",
      });
    }

    // Set session data to indicate that the user is authenticated
    req.session.userId = user._id;

    return res.status(200).json({
      status: "success",
      message: "verification successful",
      verified: verified,
    });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};

exports.protected = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: true, message: "Unauthorized" });
  }
  next();
};

exports.logout = async (req, res, next) => {
  try {
    // Destroy the session to log the user out
    req.session.destroy((err) => {
      if (err) throw err;

      return res.status(200).json({
        status: "success",
        message: "logout successful",
      });
    });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};
