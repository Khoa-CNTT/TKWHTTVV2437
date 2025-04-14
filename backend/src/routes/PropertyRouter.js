const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/PropertyController");

router.get("/list-top-10-rating", propertyController.listTop10HomestayRating);
router.get("/detail-id/:id", propertyController.getDetailRoomById);
router.get("/detail/:slug", propertyController.getDetailBySlug);

module.exports = router;
