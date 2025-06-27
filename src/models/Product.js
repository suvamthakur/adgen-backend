const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
    },
    image: {
      type: String,
      required: true,
    },
    script: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Product", productSchema);
