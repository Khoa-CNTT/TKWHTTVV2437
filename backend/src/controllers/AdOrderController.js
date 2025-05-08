const db = require("../models");
const AdOrderService = require("../services/AdOderService");

const createAdOrder = async (req, res) => {
  try {
    const response = await AdOrderService.createAdOrder(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const getDataBarChartAdmin = async (req, res) => {
  try {
    const response = await AdOrderService.getDataBarChartAdmin(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const getListAdOrderByAdmin = async (req, res) => {
  try {
    const response = await AdOrderService.getListAdOrderByAdmin(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

module.exports = {
  createAdOrder,
  getDataBarChartAdmin,
  getListAdOrderByAdmin,
};
