const db = require("../models");
const RoomService = require("../services/RoomService");

const listRoomByUser = async (req, res) => {
  try {
    const response = await RoomService.listTop10Room();
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
  listRoomByUser,
};
