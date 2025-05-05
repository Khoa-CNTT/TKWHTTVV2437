const express = require("express");
const router = express.Router();
const advertisingController = require("../controllers/AdvertisingController");

router.get("/list-advertising", advertisingController.getListAdvertising);

module.exports = router;
