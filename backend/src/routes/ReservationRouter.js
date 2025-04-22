const express = require("express");
const router = express.Router();
const reserationController = require("../controllers/ReservationController");

router.post("/createReservation", reserationController.createReservation);

module.exports = router;
