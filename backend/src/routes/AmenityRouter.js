const express = require("express");
const router = express.Router();
const amenityController = require("../controllers/AmenityController");

router.get("/", amenityController.getAllList);

module.exports = router;
