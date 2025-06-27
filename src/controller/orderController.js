const createError = require("../utils/createError");
const generateScript = require("../utils/generateScript");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Avatar = require("../models/Avatar");
const Voice = require("../models/Voice");
const uploadOnImageKit = require("../utils/uploadOnImageKit");
const { heygenApis } = require("../utils/constants");

const VIDEO_DIMENSIONS = {
  width: 720,
  height: 1280,
};
const VIDEO_OFFSET = {
  x: 0.1,
  y: 0.28,
};
const VIDEO_AVATAR_SCALE = 0.94;
const locale = {
  English: "en-US",
  Hindi: "hi-IN",
};

module.exports = {
  createOrder: async (req, res, next) => {
    try {
      // Check video generation limit
      if (req.user.generationCount >= req.user.generationLimit) {
        throw createError(400, "Max generations exceeded");
      }

      const {
        productName,
        avatarId,
        voiceId,
        scriptLanguage,
        description,
        scriptLength,
        emotion,
      } = req.body;

      if (
        !productName ||
        !scriptLanguage ||
        !description ||
        !scriptLength ||
        !emotion
      ) {
        throw createError(400, "All fields are required");
      }

      const avatar = await Avatar.findById(avatarId);
      if (!avatar) throw createError(404, "Avatar not found");

      const voice = await Voice.findById(voiceId);
      if (!voice) throw createError(404, "Voice not found");

      // IMAGES
      if (req.files.length < 1) {
        throw createError(400, "Please upload at least 1 image");
      }
      const images = req.files;
      const imageUrls = [];
      for (const image of images) {
        const response = await uploadOnImageKit(image);

        console.log("response from uploadOnImageKit: ", response);
        imageUrls.push(response.url);
      }

      // SCRIPT GENERATION
      const noOfProducts = images.length;
      const script = await generateScript(
        noOfProducts,
        productName,
        description,
        scriptLength,
        emotion,
        scriptLanguage
      );

      // Create order
      const order = await Order.create({
        userId: req.user._id,
        avatarId: avatarId,
        voiceId: voiceId,
        productName,
        description,
        scriptLength,
        emotion,
        scriptLanguage,
        AIscript: script.join("."),
        images: imageUrls,
      });

      for (let i = 0; i < images.length; i++) {
        await Product.create({
          orderId: order._id,
          image: imageUrls[i],
          script: script[i],
        });
      }

      res.status(201).json({
        message: "Order created successfully",
        data: order,
      });
    } catch (err) {
      next(err);
    }
  },

  generateVideo: async (req, res, next) => {
    try {
      const orderId = req.body.orderId;

      const order = await Order.findById(orderId);
      if (!order) throw createError(400, "Order not found");

      // Check for retries
      if (order.orderStatus === "failed") {
        if (order.retryCount >= order.retryLimit) {
          throw createError(400, "Max retries exceeded");
        } else {
          order.retryCount++;
          await order.save();
        }
      }

      const products = await Product.find({ orderId });
      if (!products) throw createError(400, "Products not found");

      const avatar = await Avatar.findById(order.avatarId);
      if (!avatar) throw createError(400, "Avatar not found");

      const voice = await Voice.findById(order.voiceId);
      if (!voice) throw createError(400, "Voice not found");

      // Payload
      const videoInputs = [];
      for (const product of products) {
        videoInputs.push({
          character: {
            type: "avatar",
            avatar_id: avatar.avatar_id,
            offset: {
              x: VIDEO_OFFSET.x,
              y: VIDEO_OFFSET.y,
            },
            scale: VIDEO_AVATAR_SCALE,
          },
          voice: {
            type: "text",
            input_text: product.script,
            voice_id: voice.voice_id,
            emotion: order.emotion,
            locale: locale[order.scriptLanguage],
          },
          background: {
            type: "image",
            url: product.image,
          },
        });
      }
      const finalPayload = {
        title: order.productName,
        dimension: {
          width: VIDEO_DIMENSIONS.width,
          height: VIDEO_DIMENSIONS.height,
        },
        video_inputs: videoInputs,
        callback_url: process.env.BACKEND_CALLBACK_URL,
      };

      let aiResponse;
      try {
        const response = await fetch(heygenApis.GENERATE_VIDEO, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.HEYGEN_API_KEY,
          },
          body: JSON.stringify(finalPayload),
        });
        const data = await response.json();

        if (!data.data || data.error) {
          throw new Error("Heygen - Error generating video");
        }
        aiResponse = data;
      } catch (err) {
        order.orderStatus = "failed";
        await order.save();

        return res.status(400).json({
          message: err.message || "Heygen - Error generating video",
          data: order,
        });
      }

      // Update order
      order.video_id = aiResponse.data.video_id;
      order.orderStatus = "processing";
      await order.save();

      res.status(200).json({
        message: "Video generation started successfully",
        data: order,
      });
    } catch (err) {
      next(err);
    }
  },

  getProducts: async (req, res, next) => {
    try {
      const orderId = req.params.orderId;
      const products = await Product.find({ orderId });

      if (!products) throw createError(400, "Products not found");
      res.status(200).json({
        message: "Products fetched successfully",
        data: products,
      });
    } catch (err) {
      next(err);
    }
  },

  editProduct: async (req, res, next) => {
    try {
      const { productId, script } = req.body;

      const product = await Product.findById(productId);
      if (!product) throw createError(400, "Product not found");

      product.script = script;
      await product.save();

      res.status(200).json({
        message: "Product edited successfully",
        data: product,
      });
    } catch (err) {
      next(err);
    }
  },

  getOrders: async (req, res, next) => {
    try {
      const orders = await Order.find({ userId: req.user._id });
      if (!orders) throw createError(400, "Orders not found");

      res.status(200).json({
        message: "Orders fetched successfully",
        data: orders,
      });
    } catch (err) {
      next(err);
    }
  },

  getAvatars: async (req, res, next) => {
    try {
      const avatars = await Avatar.find({});
      res.status(200).json({
        message: "Avatars fetched successfully",
        data: avatars,
      });
    } catch (err) {
      next(err);
    }
  },

  getVoices: async (req, res, next) => {
    try {
      const voices = await Voice.find({});
      res.status(200).json({
        message: "Voices fetched successfully",
        data: voices,
      });
    } catch (err) {
      next(err);
    }
  },
};
