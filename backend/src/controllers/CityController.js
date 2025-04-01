const db = require("../models");
const cityService = require("../services/CityService");

const listTop10City = async (req, res) => {
  try {
    const response = await cityService.listTop10City();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

module.exports = {
  listTop10City,
};
