const createError = require("../utils/createError");
const generateScript = require("../utils/generateScript");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Avatar = require("../models/Avatar");
const Voice = require("../models/Voice");
const uploadOnImageKit = require("../utils/uploadOnImageKit");

module.exports = {
  createOrder: async (req, res, next) => {
    try {
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

  // getProducts: async (req, res, next) => {
  //   try {
  //     const orderId = req.params.orderId;
  //     const products = await Product.find({ orderId: req.params.orderId });

  //   }catch(err){
  //     next(err);
  //   }
  // }

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
