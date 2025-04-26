const db = require("../models");
const roomAvailabilityService = require("../services/RoomAvailabilityService");

const checkRoomAvailabilityByPropertyId = async (req, res) => {
  try {
    const response = await roomAvailabilityService.checkRoomAvailabilityByPropertyId(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

module.exports = {
    checkRoomAvailabilityByPropertyId,
};
