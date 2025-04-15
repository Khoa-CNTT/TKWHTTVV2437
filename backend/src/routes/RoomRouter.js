const express = require("express");
const router = express.Router();
const roomController = require("../controllers/RoomController");

router.get("/list-room/:propertyId", roomController.getListRoomByPropertyId);
router.get("/detail/:roomId", roomController.getDetailById);

module.exports = router;
