const db = require("../models");
const roomService = require("../services/RoomService");

const getListRoomByPropertyId = async (req, res) => {
  try {
    const response = await roomService.getListRoomByPropertyId(
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

const searchListRoomForBooking = async (req, res) => {
  try {
    const response = await roomService.searchListRoomForBooking(
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
    return res.status(500).json({
      msg: "Error in controller: " + (error.message || "Unknown error"),
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

const updateStatusRoom = async (req, res) => {
  try {
    const response = await roomService.updateStatusRoom(
      req.params.id,
      req.body.status
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const getTopReventRoomByPropertyId = async (req, res) => {
  try {
    const response = await roomService.getTopReventRoomByPropertyId(
      req.params.id
    );
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
  updateRoom,
  searchListRoomForBooking,
  updateStatusRoom,
  getTopReventRoomByPropertyId,
};
