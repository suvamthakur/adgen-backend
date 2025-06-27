const mongoose = require("mongoose");

const avatarSchema = new mongoose.Schema({
  avatar_id: {
    type: String,
    required: true,
    unique: true,
  },
  avatar_name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  preview_image_url: {
    type: String,
    required: true,
  },
  preview_video_url: {
    type: String,
    required: true,
  },
  premium: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: null,
  },
  default_voice_id: {
    type: String,
    default: null,
  },
});

module.exports = new mongoose.model("Avatar", avatarSchema);
