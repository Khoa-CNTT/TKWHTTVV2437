const express = require("express");
const router = express.Router();
const cityController = require("../controllers/CityController");

router.get("/list-top-10-city", cityController.listTop10City);

module.exports = router;
