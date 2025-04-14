const db = require("../models");
const ReviewService = require("../services/ReviewService");

const getRatingByPropertyId = async (req, res) => {
  try {
    const response = await ReviewService.getRatingByPropertyId(
      req.params.propertyId
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

module.exports = {
  getRatingByPropertyId,
};
