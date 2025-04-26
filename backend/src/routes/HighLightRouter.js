const express = require("express");
const router = express.Router();
const highlightController = require("../controllers/HighLightController");

router.get("/", highlightController.getAllList);

module.exports = router;
