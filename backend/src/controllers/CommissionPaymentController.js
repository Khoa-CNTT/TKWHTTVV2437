const db = require("../models");
const commissionPaymentService = require("../services/CommissionPaymentService");

const getListCommissionPaymentByPropertyId = async (req, res) => {
  try {
    const response =
      await commissionPaymentService.getListCommissionPaymentByPropertyId(
        req.query,
        req.params.id
      );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const updateCommissionPayment = async (req, res) => {
  try {
    const response = await commissionPaymentService.updateCommissionPayment(
      req.params.id,
      req.body
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const getDataBarChartCommissionAdmin = async (req, res) => {
  try {
    const response =
      await commissionPaymentService.getDataBarChartCommissionAdmin(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const getListCommissionPaymentByAdmin = async (req, res) => {
  try {
    const response =
      await commissionPaymentService.getListCommissionPaymentByAdmin(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const getCommissionPaymentByPropertyId = async (req, res) => {
  try {
    const response =
      await commissionPaymentService.getCommissionPaymentByPropertyId(
        req.query,
        req.params.id
      );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

module.exports = {
  getListCommissionPaymentByPropertyId,
  updateCommissionPayment,
  getDataBarChartCommissionAdmin,
  getListCommissionPaymentByAdmin,
  getCommissionPaymentByPropertyId,
};
