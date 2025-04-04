const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const {
  authMiddleWare,
  authUserMiddleWare,
} = require("../middlewares/authMiddleware");

router.post("/sendMailOTP", userController.sendMailOTP);
router.post("/verifyOTP", userController.verifyOTP);
router.post("/verifyOTPLogin", userController.verifyOTPLogin);
router.post("/sign-up", userController.registerUser);
router.post("/sign-in", userController.signInUser);
router.post("/log-out", userController.logOutUser);
router.post("/refresh-token", userController.refreshToken);
router.get("/detail-user/:id", authUserMiddleWare, userController.detailUser);
router.put("/updateUser", authUserMiddleWare, userController.updateUser);

module.exports = router;
