const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/PropertyController");

router.get(
  "/hightlights/:id",
  propertyController.getListHightlightByPropertyId
);
router.get("/amenities/:id", propertyController.getListAmenityByPropertyId);
router.get("/list-top-10-rating", propertyController.listTop10HomestayRating);
router.get("/detail-id/:id", propertyController.getDetailProperyById);
router.get("/detail/:slug", propertyController.getDetailBySlug);
router.post("/", propertyController.createProperty);
router.get("/fetch-full-data", propertyController.fetchFullData);

module.exports = router;
