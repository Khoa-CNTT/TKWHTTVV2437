const express = require("express");
const router = express.Router();
const aiController = require("../controllers/AIController");

router.get("/", aiController.query);
router.post("/embeding", aiController.saveEmbeddings);
router.get("/document", aiController.getDocuments);

module.exports = router;
