const express = require("express");
const router = express.Router();
const roomController = require("../controllers/RoomController");

router.get("/list-room", roomController.listRoomByUser);

module.exports = router;
