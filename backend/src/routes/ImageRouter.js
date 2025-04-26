const express = require("express");
const router = express.Router();
const imageController = require("../controllers/ImageController");
const upload = require("../config/cloudinary").upload;

router.post(
  "/upload-multiple",
  upload.array("images", 10),
  imageController.uploadMultiple
);

module.exports = router;
