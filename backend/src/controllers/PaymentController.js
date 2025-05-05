const db = require("../models");
const paymentService = require("../services/PaymentService");

const createPaymentUrl = async (req, res) => {
  try {
    await paymentService.createPaymentUrl(req, res);
    // return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const vnPayReturn = async (req, res) => {
  try {
    const response = await paymentService.vnpay_ipn(req, res);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

module.exports = {
  createPaymentUrl,
  vnPayReturn,
};
