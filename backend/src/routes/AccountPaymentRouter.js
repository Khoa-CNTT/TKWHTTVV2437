const express = require("express");
const router = express.Router();
const accountPaymentController = require("../controllers/AccountPaymentController");
const {
  authMiddleWare,
  authUserMiddleWare,
} = require("../middlewares/authMiddleware");

router.post("/create", authUserMiddleWare, accountPaymentController.create);
router.get(
  "/infoAccountPaymment",
  accountPaymentController.infoAccountPaymment
);
router.put(
  "/updateAccountPaymment",
  authUserMiddleWare,
  accountPaymentController.updateAccountPaymment
);
router.delete(
  "/deleteAccountPaymment",
  authUserMiddleWare,
  accountPaymentController.deleteAccountPaymment
);

module.exports = router;
