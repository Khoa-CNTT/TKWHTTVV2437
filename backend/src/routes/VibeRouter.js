const express = require("express");
const vibeController = require("../controllers/AddressController");

const router = express.Router();

router.post("/", vibeController.create);
// router.get("/", vibeController.getAll);
router.get("/:id", vibeController.getById);
router.put("/:id", vibeController.update);
router.delete("/:id", vibeController.delete);

module.exports = router;
