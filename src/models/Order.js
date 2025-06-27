const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      required: true,
      default: "pending",
    },
    avatarId: {
      type: mongoose.Types.ObjectId,
      ref: "Avatar",
    },
    voiceId: {
      type: mongoose.Types.ObjectId,
      ref: "Voice",
    },

    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    scriptLength: {
      type: Number,
      required: true,
    },
    emotion: {
      type: String,
      enum: ["Excited", "Friendly", "Serious", "Soothing", "Broadcaster"],
      required: true,
    },
    scriptLanguage: {
      type: String,
      enum: ["English", "Hindi"],
      required: true,
    },
    AIscript: {
      type: String,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],

    // Heygen output
    videoId: {
      type: String,
    },
    thumbnail_url: {
      type: String,
    },
    video_url: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Order", orderSchema);
