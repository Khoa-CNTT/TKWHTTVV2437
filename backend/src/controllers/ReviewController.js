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

const createReview = async (req, res) => {
  try {
    const response = await ReviewService.createReview(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const response = await ReviewService.updateReview(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const getReviewByUserId = async (req, res) => {
  try {
    const response = await ReviewService.getReviewByUserId(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

module.exports = {
  getRatingByPropertyId,
  getListReviewByProperyId,
  createReview,
  updateReview,
  getReviewByUserId,
};
