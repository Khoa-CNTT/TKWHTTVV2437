const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");
const User = require("../models/User"); // Giả sử bạn có model User

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newUser = await User.create({ name, email, password, role });
    res.status(201).json({ message: "User created", user: newUser }); // trả về user mới tạo.
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedRows = await User.destroy({ where: { id: req.params.id } });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({ message: "User status updated", user });// trả về user sau khi update.
  } catch (error) {
    console.error("Error toggling user status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};