const express = require("express");
const router = express.Router();
const adOrderController = require("../controllers/AdOrderController");

router.post("/create", adOrderController.createAdOrder);

module.exports = router;
