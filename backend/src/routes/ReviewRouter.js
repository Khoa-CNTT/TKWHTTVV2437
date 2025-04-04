const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/ReviewController");

router.get("/rating-by-room/:roomId", reviewController.getRatingByRoomId);

module.exports = router;
