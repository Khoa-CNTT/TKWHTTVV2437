const express = require("express");
const router = express.Router();
const roomController = require("../controllers/RoomController");

router.get("/list-room/:propertyId", roomController.getListRoomByPropertyId);
router.get(
  "/list-booking/:propertyId",
  roomController.searchListRoomForBooking
);
router.get(
  "/top-revenue-room/:id",
  roomController.getTopReventRoomByPropertyId
);
router.get("/detail/:roomId", roomController.getDetailById);
router.post("/", roomController.createRoom);
router.put("/:id", roomController.updateRoom);
router.put("/update-status/:id", roomController.updateStatusRoom);

module.exports = router;
