const express = require("express");
const router = express.Router();

const registerParnerController = require("../controllers/RegisterPartnerController");
const {
  authMiddleWare,
  authUserMiddleWare,
} = require("../middlewares/authMiddleware");

router.post("/registerPartner", registerParnerController.registerPartner);

router.get(
  "/detail-registerPartner/:idUser",
  registerParnerController.detailRegisterPartner
);
router.put(
  "/update-registerPartner",
  registerParnerController.updateRegisterPartner
);

router.delete(
  "/delete-registerPartner/:idUser",
  registerParnerController.cancelRegisterPartner
);

router.get(
  "/getAll-registerPartner",
  registerParnerController.getAllRegisterPartner
);

module.exports = router;
