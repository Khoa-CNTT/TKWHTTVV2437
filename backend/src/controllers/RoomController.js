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

module.exports = {
  getListRoomByPropertyId,
};
