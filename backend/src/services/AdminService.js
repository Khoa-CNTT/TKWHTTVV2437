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
      const isCorrectPassword = bcrypt.compareSync(
        password,
        checkAdmin.password
      );
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
    return {
      status: "OK",
      msg: "Owner registered successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const createUser = async (userData, role) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const response = await db.User.create({
      id: v4(),
      ...userData,
      password: hashedPassword,
      role,
    });
    return { status: "OK", msg: "User created successfully", data: response };
  } catch (error) {
    throw error;
  }
};

const updateUser = async (id, userData, role) => {
  try {
    const response = await db.User.update(userData, { where: { id, role } });
    return { status: "OK", msg: "User updated successfully", data: response };
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (id, role) => {
  try {
    const response = await db.User.destroy({ where: { id, role } });
    return { status: "OK", msg: "User deleted successfully", data: response };
  } catch (error) {
    throw error;
  }
};

const listUsers = async (role) => {
  try {
    const users = await db.User.findAll();
    return { status: "OK", data: users };
  } catch (error) {
    throw error;
  }
};

const lockAccount = async (id) => {
  try {
    const response = await db.User.update(
      { status: "locked" },
      { where: { id } }
    );
    return { status: "OK", msg: "Account locked successfully", data: response };
  } catch (error) {
    throw error;
  }
};

const createCategory = async (categoryData) => {
  try {
    const response = await db.Category.create(categoryData);
    return {
      status: "OK",
      msg: "Category created successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const updateCategory = async (id, categoryData) => {
  try {
    const response = await db.Category.update(categoryData, { where: { id } });
    return {
      status: "OK",
      msg: "Category updated successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const deleteCategory = async (id) => {
  try {
    const response = await db.Category.destroy({ where: { id } });
    return {
      status: "OK",
      msg: "Category deleted successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const listCategories = async () => {
  try {
    const categories = await db.Category.findAll();
    return { status: "OK", data: categories };
  } catch (error) {
    throw error;
  }
};

const createLocation = async (locationData) => {
  try {
    const response = await db.City.create(locationData);
    return {
      status: "OK",
      msg: "Location created successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const updateLocation = async (id, locationData) => {
  try {
    const response = await db.City.update(locationData, { where: { id } });
    return {
      status: "OK",
      msg: "Location updated successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const deleteLocation = async (id) => {
  try {
    const response = await db.City.destroy({ where: { id } });
    return {
      status: "OK",
      msg: "Location deleted successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const listLocations = async () => {
  try {
    const locations = await db.City.findAll();
    return { status: "OK", data: locations };
  } catch (error) {
    throw error;
  }
};

const createAmenity = async (amenityData) => {
  try {
    const response = await db.Amenity.create(amenityData);
    return {
      status: "OK",
      msg: "Amenity created successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const updateAmenity = async (id, amenityData) => {
  try {
    const response = await db.Amenity.update(amenityData, { where: { id } });
    return {
      status: "OK",
      msg: "Amenity updated successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const deleteAmenity = async (id) => {
  try {
    const response = await db.Amenity.destroy({ where: { id } });
    return {
      status: "OK",
      msg: "Amenity deleted successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const listAmenities = async () => {
  try {
    const amenities = await db.Amenity.findAll();
    return { status: "OK", data: amenities };
  } catch (error) {
    throw error;
  }
};

const approveHomestay = async (id) => {
  try {
    const response = await db.Property.update(
      { status: "approved" },
      { where: { id } }
    );
    return {
      status: "OK",
      msg: "Homestay approved successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const rejectHomestay = async (id) => {
  try {
    const response = await db.Property.update(
      { status: "rejected" },
      { where: { id } }
    );
    return {
      status: "OK",
      msg: "Homestay rejected successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const updateHomestay = async (id, homestayData) => {
  try {
    const response = await db.Property.update(homestayData, { where: { id } });
    return {
      status: "OK",
      msg: "Homestay updated successfully",
      data: response,
    };
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

const listPayments = async () => {
  try {
    const payments = await db.Payment.findAll();
    return { status: "OK", data: payments };
  } catch (error) {
    throw error;
  }
};

const refundPayment = async (id) => {
  try {
    const response = await db.Payment.update(
      { paymentStatus: "refunded" },
      { where: { id } }
    );
    return {
      status: "OK",
      msg: "Payment refunded successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const listBookings = async () => {
  try {
    const bookings = await db.Reservation.findAll();
    return { status: "OK", data: bookings };
  } catch (error) {
    throw error;
  }
};

const confirmBooking = async (id) => {
  try {
    const response = await db.Reservation.update(
      { status: "confirmed" },
      { where: { id } }
    );
    return {
      status: "OK",
      msg: "Booking confirmed successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const cancelBooking = async (id) => {
  try {
    const response = await db.Reservation.update(
      { status: "canceled" },
      { where: { id } }
    );
    return {
      status: "OK",
      msg: "Booking canceled successfully",
      data: response,
    };
  } catch (error) {
    throw error;
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
