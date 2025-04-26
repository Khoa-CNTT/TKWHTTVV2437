const express = require("express");
const router = express.Router();
const aiController = require("../controllers/AIController");

router.get("/", aiController.query);

module.exports = router;
