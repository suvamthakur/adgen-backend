const express = require("express");
const orderController = require("../controller/orderController");
const router = express.Router();
const upload = require("../middlewares/multerMiddleware");
const { userAuth } = require("../middlewares/userAuth");
const webhookController = require("../controller/webhookController");

MAX_IMAGE_COUNT = 4;

router.post(
  "/create",
  userAuth,
  upload.array("image", MAX_IMAGE_COUNT),
  orderController.createOrder
);
router.post("/video/generate", userAuth, orderController.generateVideo);
router.get("/products/:orderId", userAuth, orderController.getProducts);
router.patch("/product/edit", userAuth, orderController.editProduct);

router.get("/all", userAuth, orderController.getOrders);
router.get("/avatars", userAuth, orderController.getAvatars);
router.get("/voices", userAuth, orderController.getVoices);

// Webhook route
router.post("/webhook/video-status", webhookController.orderStatusWebhook);

module.exports = router;
