const multer = require("multer");
const fs = require("node:fs");
const path = require("node:path");
const createError = require("../utils/createError");

const uploadDir = path.join(__dirname, "../../public/temp");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // create the directory and its parent directories { recursive: true } if they do not exist
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10mb
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.includes("image")) {
      return cb(createError(400, "Only image files are allowed"), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
