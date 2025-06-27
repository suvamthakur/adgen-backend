const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minlength: [2, "First name must be at least 2 characters long"],
      maxLength: [30, "First name cannot exceed 30 characters"],
      required: true,
    },
    lastName: {
      type: String,
      minlength: [2, "Last name must be at least 2 characters long"],
      maxLength: [30, "Last name cannot exceed 30 characters"],
      required: true,
    },
    email: {
      type: String,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },

    // Monthly
    generationCount: {
      type: Number,
      default: 0,
    },
    generationLimit: {
      type: Number,
      default: 3,
    },
  },
  { timestamps: true }
);

const SALT_ROUNDS = 10;
userSchema.pre("save", async function (next) {
  const hashedPassword = await bcrypt.hash(this.password, SALT_ROUNDS);
  this.password = hashedPassword;
  next();
});

userSchema.methods.getJWT = async function (password) {
  const token = await jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userType: this.userType,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
  return token;
};

module.exports = new mongoose.model("User", userSchema);
