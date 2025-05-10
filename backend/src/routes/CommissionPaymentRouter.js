const express = require("express");
const router = express.Router();
const commissionPaymentController = require("../controllers/CommissionPaymentController");

router.get(
  "/all-commission/:id",
  commissionPaymentController.getListCommissionPaymentByPropertyId
);
router.get(
  "/data-bar-chart-admin",
  commissionPaymentController.getDataBarChartCommissionAdmin
);
router.get(
  "/list-commission-admin",
  commissionPaymentController.getListCommissionPaymentByAdmin
);
router.put("/:id", commissionPaymentController.updateCommissionPayment);

module.exports = router;
