const AdminService = require("../services/AdminService");

const manageUsers = async (req, res) => {
  try {
    const { action, userId } = req.body;
    if (!action || !userId) {
      return res.status(200).json({
        status: "ERR",
        msg: "Action and userId are required",
      });
    }

    const response = await AdminService.manageUsers(action, userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const manageHomestayResort = async (req, res) => {
  try {
    const { action, homestayResortId } = req.body;
    if (!action || !homestayResortId) {
      return res.status(200).json({
        status: "ERR",
        msg: "Action and homestayResortId are required",
      });
    }

    const response = await AdminService.manageHomestayResort(action, homestayResortId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const manageBookingsPayments = async (req, res) => {
  try {
    const { action, bookingId } = req.body;
    if (!action || !bookingId) {
      return res.status(200).json({
        status: "ERR",
        msg: "Action and bookingId are required",
      });
    }

    const response = await AdminService.manageBookingsPayments(action, bookingId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

module.exports = {
  manageUsers,
  manageHomestayResort,
  manageBookingsPayments,
};