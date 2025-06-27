const User = require("../models/User");
const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");

module.exports = {
  userAuth: async (req, res, next) => {
    try {
      const token = req.cookies.token;

      if (!token) {
        throw new Error("Token not found");
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id);
      if (!user) {
        throw new Error("User not found");
      }

      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  },
};
