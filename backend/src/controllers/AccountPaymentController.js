const accountPaymentService = require("../services/AccountPaymentService");

const create = async (req, res) => {
  try {
    const response = await accountPaymentService.create(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const infoAccountPaymment = async (req, res) => {
  try {
    const { uid } = req.query;
    const response = await accountPaymentService.infoAccountPaymment(uid);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const deleteAccountPaymment = async (req, res) => {
  try {
    const { aid } = req.query;
    const response = await accountPaymentService.deleteAccountPaymment(aid);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const updateAccountPaymment = async (req, res) => {
  try {
    const { aid } = req.query;
    const response = await accountPaymentService.updateAccountPaymment(
      aid,
      req.body
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

module.exports = {
  create,
  infoAccountPaymment,
  deleteAccountPaymment,
  deleteAccountPaymment,
  updateAccountPaymment,
};
