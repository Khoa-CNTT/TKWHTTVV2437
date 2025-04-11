const express = require("express");
const router = express.Router();
const roomController = require("../controllers/RoomController");

router.get("/list-top-10-rating", roomController.listTop10Rating);
router.get("/detail-id/:id", roomController.getDetailRoomById);
router.get("/detail/:slug", roomController.getDetailRoomBySlug);

module.exports = router;
