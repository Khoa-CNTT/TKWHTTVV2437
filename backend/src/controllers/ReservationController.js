const ReservationService = require("../services/ReservationService");

const lockBooking = async (req, res) => {
  try {
    const response = await ReservationService.lockBooking(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

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
    const { reid, status, returnImgBanking, reason, ...payload } = req.body;

    const response = await ReservationService.approveReservation({
      reid,
      status,
      returnImgBanking,
      payload,
      reason,
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const listReservationOfUser = async (req, res) => {
  try {
    const { idUser } = req.query;
    const response = await ReservationService.listReservationOfUser(idUser);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};
const getDataBarChart = async (req, res) => {
  try {
    const response = await ReservationService.getDataBarChart(
      req.params.id,
      req.query
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const detailReservationOfUser = async (req, res) => {
  try {
    const { idRes } = req.query;
    const response = await ReservationService.detailReservationOfUser(idRes);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const getTimeOfResLockbyId = async (req, res) => {
  try {
    const { idRes } = req.query;
    const response = await ReservationService.getTimeOfResLockbyId(idRes);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const updateInfoReservation = async (req, res) => {
  try {
    const response = await ReservationService.updateInfoReservation(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const updateStatusUserReservation = async (req, res) => {
  try {
    const response = await ReservationService.updateStatusUserReservation(
      req.body
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};
module.exports = {
  lockBooking,
  createReservation,
  listReservationApprove,
  detailReservationApprove,
  approveReservation,
  listReservationOfUser,
  detailReservationOfUser,
  updateInfoReservation,
  getDataBarChart,
  updateStatusUserReservation,
  getTimeOfResLockbyId,
};
