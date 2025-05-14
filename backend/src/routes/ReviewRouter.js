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

router.post("/create-review", reviewController.createReview);

router.put("/update-review", reviewController.updateReview);

router.get("/review-by-user", reviewController.getReviewByUserId);

module.exports = router;
