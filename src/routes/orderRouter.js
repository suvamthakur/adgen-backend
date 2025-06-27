const express = require("express");
const orderController = require("../controller/orderController");
const router = express.Router();
const upload = require("../middlewares/multerMiddleware");
const { userAuth } = require("../middlewares/userAuth");

MAX_IMAGE_COUNT = 4;

router.post(
  "/create",
  userAuth,
  upload.array("image", MAX_IMAGE_COUNT),
  orderController.createOrder
);

router.get("/avatars", userAuth, orderController.getAvatars);
router.get("/voices", userAuth, orderController.getVoices);

module.exports = router;
