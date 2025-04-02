const db = require("../models");
const bcrypt = require("bcrypt");
const { v4 } = require("uuid");

const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(12));

const getAllUsers = async () => {
  try {
    const users = await db.User.findAll();
    return { status: "OK", data: users };
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

const createUser = async (newUser) => {
  try {
    const { name, email, password, role } = newUser;
    const hashedPassword = hashPassword(password);
    
    const user = await db.User.create({
      id: v4(),
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    return { status: "OK", message: "User created successfully", data: user };
  } catch (error) {
    throw new Error("Error creating user: " + error.message);
  }
};

const deleteUser = async (id) => {
  try {
    const deleted = await db.User.destroy({ where: { id } });
    if (!deleted) return { status: "ERR", message: "User not found" };
    return { status: "OK", message: "User deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting user: " + error.message);
  }
};

const toggleUserStatus = async (id) => {
  try {
    const user = await db.User.findByPk(id);
    if (!user) return { status: "ERR", message: "User not found" };
    
    user.isActive = !user.isActive;
    await user.save();
    return { status: "OK", message: "User status updated" };
  } catch (error) {
    throw new Error("Error updating user status: " + error.message);
  }
};

module.exports = { getAllUsers, createUser, deleteUser, toggleUserStatus };
