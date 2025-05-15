const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/ReservationController");

router.post("/lockBooking", reservationController.lockBooking);
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

router.get("/getTimeOfResLockbyId", reservationController.getTimeOfResLockbyId);

router.get("/bar-chart/:id", reservationController.getDataBarChart);

router.put("/approveReservation", reservationController.approveReservation);
router.put(
  "/updateInfoReservation",
  reservationController.updateInfoReservation
);
router.put(
  "/updateStatusUserReservation",
  reservationController.updateStatusUserReservation
);

router.get(
  "/listReservationByAdmin",
  reservationController.listReservationByAdmin
);
module.exports = router;
