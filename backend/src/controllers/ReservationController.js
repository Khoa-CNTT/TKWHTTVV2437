const ReservationService = require("../services/ReservationService");

const createReservation = async (req, res) => {
  try {
    const response = await ReservationService.createReservation(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

module.exports = {
  createReservation,
};
