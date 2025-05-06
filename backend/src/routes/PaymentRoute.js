const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/PaymentController");

router.post("/create-url", paymentController.createPaymentUrl);
router.get("/vnpay_return", paymentController.vnPayReturn);
router.post(
  "/create-url-commission",
  paymentController.createPaymentUrlCommission
);
router.get("/vnpay_return_commission", paymentController.vnPayReturnCommission);

module.exports = router;
