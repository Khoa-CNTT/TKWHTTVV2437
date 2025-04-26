const db = require("../models");
const amenityService = require("../services/AmenityService");

const getAllList = async (req, res) => {
  try {
    const response = await amenityService.getAllList();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

module.exports = {
  getAllList,
};
