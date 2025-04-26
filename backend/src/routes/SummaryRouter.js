const express = require("express");
const router = express.Router();
const summaryController = require('../controllers/SummaryController')

router.get("/", summaryController.getAllList);

module.exports = router;
