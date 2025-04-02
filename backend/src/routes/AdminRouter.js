const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");
const { authAdminMiddleware } = require("../middlewares/authMiddleware");

router.post("/manage-users", authAdminMiddleware, adminController.manageUsers);
router.post("/manage-homestay-resort", authAdminMiddleware, adminController.manageHomestayResort);
router.post("/manage-bookings-payments", authAdminMiddleware, adminController.manageBookingsPayments);

module.exports = router;