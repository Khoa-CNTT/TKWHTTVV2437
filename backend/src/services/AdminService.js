const { Op } = require("sequelize"); 
const { v4 } = require("uuid"); 
require("dotenv").config(); 
const bcrypt = require("bcrypt"); 
const db = require("../models");
const { generalAccessToken, generalRefreshToken } = require("./JwtService");

const loginAdmin = (admin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = admin;

    if (!email || !password) {
      resolve({ status: "ERR", msg: "Email and password are required" });
      return;
    }

    try {
      const checkAdmin = await db.User.findOne({
        where: { email, role: "1" }, 
        raw: true,
      });

      if (checkAdmin === null) {
        resolve({ status: "ERR", msg: "The admin is not defined" });
        return;
      }

      const isCorrectPassword = bcrypt.compareSync(password, checkAdmin.password);
      if (!isCorrectPassword) {
        resolve({
          status: "ERR",
          msg: "The password or admin is incorrect",
        });
        return;
      }

      const access_token = await generalAccessToken({
        id: checkAdmin.id,
        role: checkAdmin.role,
      });
      const refresh_token = await generalRefreshToken({
        id: checkAdmin.id,
        role: checkAdmin.role,
      });

      resolve({
        status: "OK",
        msg: "SUCCESS",
        access_token,
        refresh_token,
      });
    } catch (error) {
      reject(error);
    }
  });
};


const registerOwner = async (ownerData) => {
  try {
    const hashedPassword = await bcrypt.hash(ownerData.password, 10); 
    const response = await db.User.create({
      id: v4(), 
      ...ownerData,
      password: hashedPassword,
      role: "2", 
    });
    return { status: "OK", msg: "Owner registered successfully", data: response };
  } catch (error) {
    throw error;
  }
};

const updateOwner = async (id, ownerData) => {
  try {
    const response = await db.User.update(ownerData, { where: { id, role: "2" } });
    return { status: "OK", msg: "Owner updated successfully", data: response };
  } catch (error) {
    throw error;
  }
};

const deleteOwner = async (id) => {
  try {
    const response = await db.User.destroy({ where: { id, role: "2" } });
    return { status: "OK", msg: "Owner deleted successfully", data: response };
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const response = await db.User.destroy({ where: { id, role: "3" } }); 
    return { status: "OK", msg: "User deleted successfully", data: response };
  } catch (error) {
    throw error;
  }
};

const listUsers = async () => {
  try {
    const users = await db.User.findAll({ where: { role: "3" } });
    return { status: "OK", data: users };
  } catch (error) {
    throw error;
  }
};

const listOwners = async () => {
  try {
    const owners = await db.User.findAll({ where: { role: "2" } });
    return { status: "OK", data: owners };
  } catch (error) {
    throw error;
  }
};


const updateHomestay = async (id, homestayData) => {
  try {
    const response = await db.Property.update(homestayData, { where: { id } });
    return { status: "OK", msg: "Homestay updated successfully", data: response };
  } catch (error) {
    throw error;
  }
};

const listHomestays = async () => {
  try {
    const homestays = await db.Property.findAll();
    return { status: "OK", data: homestays };
  } catch (error) {
    throw error;
  }
};

const manageCategories = async (categoryData) => {
  try {
    const response = await db.Category.create(categoryData);
    return { status: "OK", msg: "Category added successfully", data: response };
  } catch (error) {
    throw error;
  }
};

const manageLocations = async (locationData) => {
  try {
    const response = await db.City.create(locationData);
    return { status: "OK", msg: "Location added successfully", data: response };
  } catch (error) {
    throw error;
  }
};

const manageAmenities = async (amenityData) => {
  try {
    const response = await db.Amenity.create(amenityData);
    return { status: "OK", msg: "Amenity added successfully", data: response };
  } catch (error) {
    throw error;
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