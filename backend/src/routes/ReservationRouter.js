const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/ReservationController");

router.post("/createReservation", reservationController.createReservation);
router.get(
  "/listReservationApprove",
  reservationController.listReservationApprove
);
router.get(
  "/detailReservationApprove",
  reservationController.detailReservationApprove
);

router.get(
  "/listReservationOfUser",
  reservationController.listReservationOfUser
);

router.get(
  "/detailReservationOfUser",
  reservationController.detailReservationOfUser
);

router.put("/approveReservation", reservationController.approveReservation);
router.put(
  "/updateInfoReservation",
  reservationController.updateInfoReservation
);

module.exports = router;
