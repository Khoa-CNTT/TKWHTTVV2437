const RegisterPartnerService = require("../services/RegisterPartnerService");

const registerPartner = async (req, res) => {
  try {
    const { idUser } = req.body;
    if (!idUser) {
      return res.status(200).json({
        status: "ERR",
        msg: "The input is required",
      });
    }

    const response = await RegisterPartnerService.registerPartner(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const detailRegisterPartner = async (req, res) => {
  try {
    const idUser = req.params.idUser;
    if (!idUser) {
      return res.status(200).json({
        status: "ERR",
        msg: "UserId is required",
      });
    }

    const response = await RegisterPartnerService.detailRegisterPartner(idUser);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const updateRegisterPartner = async (req, res) => {
  try {
    const { id } = req.query;
    const { ...payload } = req.body;

    const response = await RegisterPartnerService.updateRegisterPartner(
      id,
      payload
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const cancelRegisterPartner = async (req, res) => {
  try {
    const idUser = req.params.idUser;
    if (!idUser) {
      return res.status(200).json({
        status: "ERR",
        msg: "UserId is required",
      });
    }

    const response = await RegisterPartnerService.cancelRegisterPartner(idUser);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

module.exports = {
  registerPartner,
  detailRegisterPartner,
  updateRegisterPartner,
  cancelRegisterPartner,
};
