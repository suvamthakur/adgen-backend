const User = require("../models/User");
const createError = require("../utils/createError");
const bcrypt = require("bcrypt");

module.exports = {
  signup: async (req, res, next) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      if (!firstName || !lastName || !email || !password) {
        throw createError(400, "All fields are required");
      }

      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
      });

      const token = await user.getJWT();
      res.cookie("token", token, {
        // httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      });

      res.status(201).json({
        message: "User created successfully",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw createError(400, "All fields are required");
      }

      const user = await User.findOne({ email });
      if (!user) {
        throw createError(404, "User not found");
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        throw createError(400, "Invalid credentials");
      }

      const token = await user.getJWT();
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      });

      res.status(200).json({
        message: "User logged in successfully",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },
  logout: async (req, res, next) => {
    try {
      res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
      });

      res.status(200).json({
        message: "User logged out successfully",
      });
    } catch (err) {
      next(err);
    }
  },
  getUserDetails: async (req, res, next) => {
    try {
      const user = req.user;
      res.status(200).json({
        message: "User details fetched successfully",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },
};
