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

const updateOwner = async (req, res) => {
  try {
    const response = await AdminService.updateOwner(req.params.id, req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};


const deleteOwner = async (req, res) => {
  try {
    const response = await AdminService.deleteOwner(req.params.id);
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
    const response = await AdminService.listUsers();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const listOwners = async (req, res) => {
  try {
    const response = await AdminService.listOwners();
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

const manageCategories = async (req, res) => {
  try {
    const response = await AdminService.manageCategories(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const manageLocations = async (req, res) => {
  try {
    const response = await AdminService.manageLocations(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

const manageAmenities = async (req, res) => {
  try {
    const response = await AdminService.manageAmenities(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};



module.exports = {
  loginAdmin,
  registerOwner,
  updateOwner,
  deleteOwner,
  deleteUser,
  listUsers,
  listOwners,
  updateHomestay,
  listHomestays,
  manageCategories,
  manageLocations,
  manageAmenities,
};