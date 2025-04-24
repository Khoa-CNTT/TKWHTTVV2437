const db = require("../models");
const roomService = require("../services/RoomService");

const getListRoomByPropertyId = async (req, res) => {
  try {
    const response = await roomService.getListRoomByPropertyId(
      req.params.propertyId
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const getDetailById = async (req, res) => {
  try {
    const response = await roomService.getDetailById(req.params.roomId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const createRoom = async (req, res) => {
  try {
    const response = await roomService.createRoom(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const updateRoom = async (req, res) => {
  try {
    const response = await roomService.updateRoom(req.params.id, req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};


module.exports = {
  getListRoomByPropertyId,
  getDetailById,
  createRoom,
  updateRoom
};
