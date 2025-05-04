const express = require("express");
const router = express.Router();
const roomAvailabilityController = require("../controllers/RoomAvailibityController");

router.get(
  "/list-room-availability/:id",
  roomAvailabilityController.getListRoomAvailabilityByPropertyId
);
router.post(
  "/check-room-availability",
  roomAvailabilityController.checkRoomAvailabilityByPropertyId
);

module.exports = router;
