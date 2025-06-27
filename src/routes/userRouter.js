const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();
const {userAuth} = require("../middlewares/userAuth");

router.post("/signup", userController.signup);
router.post("/login", userController.login);

router.get("/user", userAuth, userController.getUserDetails);

module.exports = router;
