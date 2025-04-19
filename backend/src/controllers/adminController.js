const AdminService = require("../services/AdminService");

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: "ERR", msg: "Email and password are required" });
    }

    const response = await AdminService.loginAdmin({ email, password });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ status: "ERR", msg: "Error: " + error.message });
  }
};

const registerOwner = async (req, res) => {
  try {
    const response = await AdminService.registerOwner(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const response = await AdminService.createUser(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const response = await AdminService.updateUser(req.params.id, req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const response = await AdminService.deleteUser(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const listUsers = async (req, res) => {
  try {
    const response = await AdminService.listUsers(req.query.role);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const lockAccount = async (req, res) => {
  try {
    const response = await AdminService.lockAccount(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const response = await AdminService.createCategory(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const response = await AdminService.updateCategory(req.params.id, req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const response = await AdminService.deleteCategory(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const listCategories = async (req, res) => {
  try {
    const response = await AdminService.listCategories();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const createLocation = async (req, res) => {
  try {
    const response = await AdminService.createLocation(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const updateLocation = async (req, res) => {
  try {
    const response = await AdminService.updateLocation(req.params.id, req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const deleteLocation = async (req, res) => {
  try {
    const response = await AdminService.deleteLocation(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const listLocations = async (req, res) => {
  try {
    const response = await AdminService.listLocations();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const createAmenity = async (req, res) => {
  try {
    const response = await AdminService.createAmenity(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const updateAmenity = async (req, res) => {
  try {
    const response = await AdminService.updateAmenity(req.params.id, req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const deleteAmenity = async (req, res) => {
  try {
    const response = await AdminService.deleteAmenity(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const listAmenities = async (req, res) => {
  try {
    const response = await AdminService.listAmenities();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const approveHomestay = async (req, res) => {
  try {
    const response = await AdminService.approveHomestay(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const rejectHomestay = async (req, res) => {
  try {
    const response = await AdminService.rejectHomestay(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const updateHomestay = async (req, res) => {
  try {
    const response = await AdminService.updateHomestay(req.params.id, req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const listHomestays = async (req, res) => {
  try {
    const response = await AdminService.listHomestays(req.query.keyword);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const listPayments = async (req, res) => {
  try {
    const response = await AdminService.listPayments();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const refundPayment = async (req, res) => {
  try {
    const response = await AdminService.refundPayment(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const listBookings = async (req, res) => {
  try {
    const response = await AdminService.listBookings();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const confirmBooking = async (req, res) => {
  try {
    const response = await AdminService.confirmBooking(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const response = await AdminService.cancelBooking(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

module.exports = {
  loginAdmin,
  registerOwner,
  createUser,
  updateUser,
  deleteUser,
  listUsers,
  lockAccount,
  createCategory,
  updateCategory,
  deleteCategory,
  listCategories,
  createLocation,
  updateLocation,
  deleteLocation,
  listLocations,
  createAmenity,
  updateAmenity,
  deleteAmenity,
  listAmenities,
  approveHomestay,
  rejectHomestay,
  updateHomestay,
  listHomestays,
  listPayments,
  refundPayment,
  listBookings,
  confirmBooking,
  cancelBooking,
};