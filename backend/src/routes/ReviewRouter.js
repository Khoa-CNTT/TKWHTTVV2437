const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/ReviewController");

router.get(
  "/rating-by-property/:propertyId",
  reviewController.getRatingByPropertyId
);

router.get(
  "/list-review/:propertyId",
  reviewController.getListReviewByProperyId
);
router.post("/property", reviewController.createProperty);

module.exports = router;
