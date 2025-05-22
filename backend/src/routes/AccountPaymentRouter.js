const express = require("express");
const router = express.Router();
const accountPaymentController = require("../controllers/AccountPaymentController");
const {
  authMiddleWare,
  authUserMiddleWare,
} = require("../middlewares/authMiddleware");

router.post("/create", accountPaymentController.create);
router.get(
  "/infoAccountPaymment",
  accountPaymentController.infoAccountPaymment
);
router.put(
  "/updateAccountPaymment",
  accountPaymentController.updateAccountPaymment
);
router.delete(
  "/deleteAccountPaymment",
  accountPaymentController.deleteAccountPaymment
);

module.exports = router;
