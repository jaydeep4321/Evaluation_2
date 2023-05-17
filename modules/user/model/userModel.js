const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const constants = require("../../../utils/constants");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    deletedAt: {
      type: Date,
    },
    secret: {
      type: String,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: {
        values: [
          constants.USER_ROLE_ADMIN,
          constants.USER_ROLE_USER,
          constants.USER_ROLE_SUPERADMIN,
        ],
        message: "{VALUE} is not supported",
      },
      default: constants.USER_ROLE_USER,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });

  next();
});

const User = mongoose.model(constants.USER_MODEL, userSchema);

module.exports = User;
