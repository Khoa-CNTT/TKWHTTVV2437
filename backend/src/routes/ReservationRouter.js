const express = require("express");
const router = express.Router();
const reserationController = require("../controllers/ReservationController");

router.post("/createReservation", reserationController.createReservation);
router.get(
  "/listReservationApprove",
  reserationController.listReservationApprove
);
router.get(
  "/detailReservationApprove",
  reserationController.detailReservationApprove
);

router.put("/approveReservation", reserationController.approveReservation);

module.exports = router;
