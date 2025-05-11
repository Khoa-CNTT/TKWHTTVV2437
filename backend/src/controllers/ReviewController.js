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

const getListReviewByProperyId = async (req, res) => {
  try {
    const response = await ReviewService.getListReviewByProperyId(
      req.params.propertyId,
      req.query
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const createProperty = async (req, res) => {
  try {
    const response = await ReviewService.createPropertyReview(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      msg: "Error in controller: " + (error.message || "Unknown error"),
    });
  }
};

module.exports = {
  createProperty,
  getRatingByPropertyId,
  getListReviewByProperyId,
};
