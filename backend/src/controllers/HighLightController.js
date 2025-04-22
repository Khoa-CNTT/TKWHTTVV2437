const db = require("../models");
const highLightService = require("../services/HighLightService");

const getAllList = async (req, res) => {
  try {
    const response = await highLightService.getAllList();
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
