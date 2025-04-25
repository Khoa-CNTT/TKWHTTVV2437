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

const listReservationApprove = async (req, res) => {
  try {
    const { filter } = req.query;
    const response = await ReservationService.listReservationApprove({
      filter,
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const detailReservationApprove = async (req, res) => {
  try {
    const { reid } = req.query;
    const response = await ReservationService.detailReservationApprove(reid);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const approveReservation = async (req, res) => {
  try {
    const { reid, status } = req.body;
    const response = await ReservationService.approveReservation({
      reid,
      status,
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};
module.exports = {
  createReservation,
  listReservationApprove,
  detailReservationApprove,
  approveReservation,
};
