const mongoose = require("mongoose");

const voiceSchema = new mongoose.Schema({
  voice_id: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    enum: ["English", "Hindi"],
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  preview_audio: {
    type: String,
    required: true,
  },
  support_pause: {
    type: Boolean,
    default: false,
  },
  emotion_support: {
    type: Boolean,
    default: false,
  },
  support_interactive_avatar: {
    type: Boolean,
    default: false,
  },
  support_locale: {
    type: Boolean,
    default: false,
  },
});

module.exports = new mongoose.model("Voice", voiceSchema);
