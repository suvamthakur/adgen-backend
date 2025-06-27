const Order = require("../models/Order");
const User = require("../models/User");
const { heygenApis } = require("../utils/constants");

module.exports = {
  async orderStatusWebhook(req, res) {
    try {
      console.log("req.body: ", req.body);
      const { event_type, event_data } = req.body;

      const video_id = event_data.video_id;
      const order = await Order.findOne({ video_id });

      if (!order) {
        console.log("Order not found");
        return res
          .status(200)
          .json({ message: "Order not found, but acknowledged" });
      }

      // Get user details
      const user = await User.findById(order.userId);
      if (!user) {
        console.log("User not found");
        return res
          .status(200)
          .json({ message: "User not found, but acknowledged" });
      }

      if (event_type === "avatar_video.failed") {
        order.orderStatus = "failed";
        await order.save();

        // SEND SSE
        return res.status(200).json({ message: "Order marked as failed" });
      }
      if (event_type === "avatar_video.success") {
        // Get video details
        const response = await fetch(
          heygenApis.VIDEO_STATUS + `?video_id=${video_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.HEYGEN_API_KEY,
            },
          }
        );
        const data = await response.json();

        order.thumbnail_url = data.data.thumbnail_url;
        order.video_url = data.data.video_url;
        order.orderStatus = "completed";
        user.generationCount++;
        await user.save();
        await order.save();

        // SEND SSE
        return res.status(200).json({ message: "Order marked as completed" });
      }

      return res
        .status(200)
        .json({ message: "Unknown event type, but acknowledged" });
    } catch (err) {
      return res
        .status(200)
        .json({ message: "Error occurred, but acknowledged" });
    }
  },
};
