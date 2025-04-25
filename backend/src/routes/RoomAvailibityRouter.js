const express = require("express");
const router = express.Router();
const roomAvailabilityController = require('../controllers/RoomAvailibityController')

router.post("/check-room-availability", roomAvailabilityController.checkRoomAvailabilityByPropertyId);

module.exports = router;
