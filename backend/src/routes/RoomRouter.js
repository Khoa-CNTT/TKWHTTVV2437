const express = require("express");
const router = express.Router();
const roomController = require("../controllers/RoomController");

router.get("/list-room/:propertyId", roomController.getListRoomByPropertyId);

module.exports = router;
