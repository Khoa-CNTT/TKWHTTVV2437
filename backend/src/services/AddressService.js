const db = require("../models");
import { v4 } from "uuid";
const createAddress = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const address = await db.Address.create({
        ...data,
        id: v4(),
      }); // Tạo mới Address
      resolve({
        status: "OK",
        data: address,
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: `Error creating address: ${error.message}`,
      });
    }
  });
};

const getAllAddresses = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const addresses = await db.Address.findAll({
        include: [{ model: db.Vibe, as: "vibes" }], // Bao gồm mối quan hệ với Vibe
      });
      resolve({
        status: addresses.length > 0 ? "OK" : "ERR",
        data: addresses || [],
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: `Error fetching addresses: ${error.message}`,
      });
    }
  });
};

const getAddressById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const address = await db.Address.findByPk(id, {
        include: [{ model: db.Vibe, as: "vibes" }], // Bao gồm mối quan hệ với Vibe
      });
      if (!address) {
        resolve({
          status: "ERR",
          message: "Address not found",
        });
      } else {
        resolve({
          status: "OK",
          data: address,
        });
      }
    } catch (error) {
      reject({
        status: "ERR",
        message: `Error fetching address: ${error.message}`,
      });
    }
  });
};

const updateAddress = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const address = await db.Address.findByPk(id); // Tìm Address theo ID
      if (!address) {
        resolve({
          status: "ERR",
          message: "Address not found",
        });
      } else {
        await address.update(data); // Cập nhật Address
        resolve({
          status: "OK",
          data: address,
        });
      }
    } catch (error) {
      reject({
        status: "ERR",
        message: `Error updating address: ${error.message}`,
      });
    }
  });
};

const deleteAddress = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const address = await db.Address.findByPk(id); // Tìm Address theo ID
      if (!address) {
        resolve({
          status: "ERR",
          message: "Address not found",
        });
      } else {
        await address.destroy(); // Xóa Address
        resolve({
          status: "OK",
          message: "Address deleted successfully",
        });
      }
    } catch (error) {
      reject({
        status: "ERR",
        message: `Error deleting address: ${error.message}`,
      });
    }
  });
};

module.exports = {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};
