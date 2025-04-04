const db = require("../models");
const RoomService = require("../services/RoomService");

const listTop10Rating = async (req, res) => {
  try {
    const response = await RoomService.listTop10Room();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const getDetailRoomBySlug = async (req, res) => {
  try {
    const response = await RoomService.getDetailRoomBySlug(req.params.slug);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

module.exports = {
  listTop10Rating,
  getDetailRoomBySlug,
};
