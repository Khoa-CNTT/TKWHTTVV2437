const express = require("express");
const addressController = require("../controllers/AddressController");
const router = express.Router();

router.post("/", addressController.create);
router.get("/:id", addressController.getById);
router.put("/:id", addressController.update);
router.delete("/:id", addressController.delete);

module.exports = router;
