const express = require("express");
const router = express.Router();
const adOrderController = require("../controllers/AdOrderController");

router.post("/create", adOrderController.createAdOrder);
router.get("/get-data-bar-chart-admin", adOrderController.getDataBarChartAdmin);

module.exports = router;
