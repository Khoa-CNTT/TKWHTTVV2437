const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/ReviewController");

router.get(
  "/rating-by-property/:propertyId",
  reviewController.getRatingByPropertyId
);

module.exports = router;
