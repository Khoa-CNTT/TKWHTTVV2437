const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const {
  authMiddleWare,
  authUserMiddleWare,
} = require("../middlewares/authMiddleware");

router.post("/checkMail", userController.checkMail);
router.post("/sendMailOTP", userController.sendMailOTP);
router.post("/verifyOTP", userController.verifyOTP);
router.post("/verifyOTPLogin", userController.verifyOTPLogin);
router.post("/sign-up", userController.registerUser);
router.post("/sign-in", userController.signInUser);
router.get("/log-out", userController.logOutUser);
router.post("/refresh-token", userController.refreshToken);
router.get("/detail-user/:id", authUserMiddleWare, userController.detailUser);
router.put("/updateUser", authUserMiddleWare, userController.updateUser);
router.get(
  "/total-dashboard-admin",
  userController.getTotalUserForAdminDashboard
);
router.get("/data-line-chart-admin", userController.getDataLineChartUserAdmin);

module.exports = router;
