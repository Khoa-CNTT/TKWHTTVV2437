const db = require("../models");
const PropertyService = require("../services/PropertyService");

const listTop10HomestayRating = async (req, res) => {
  try {
    const response = await PropertyService.listTop10HomestayRating();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const getDetailBySlug = async (req, res) => {
  try {
    const response = await PropertyService.getDetailBySlug(req.params.slug);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const getDetailRoomById = async (req, res) => {
  try {
    const response = await RoomService.getDetailRoomById(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

module.exports = {
  listTop10HomestayRating,
  getDetailBySlug,
  getDetailRoomById,
};
