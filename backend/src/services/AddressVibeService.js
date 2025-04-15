"use strict";

const { AddressVibe } = require("../models");

// Tạo mới một AddressVibe
async function createAddressVibe(data) {
  try {
    const addressVibe = await AddressVibe.create(data);
    return addressVibe;
  } catch (error) {
    throw new Error("Error creating AddressVibe: " + error.message);
  }
}

// Lấy tất cả AddressVibe
async function findAll() {
  try {
    return await AddressVibe.findAll();
  } catch (error) {
    throw new Error("Error fetching AddressVibes: " + error.message);
  }
}

// Lấy một AddressVibe theo addressId và vibeId
async function findOne(addressId, vibeId) {
  try {
    return await AddressVibe.findOne({
      where: { addressId, vibeId },
    });
  } catch (error) {
    throw new Error("Error finding AddressVibe: " + error.message);
  }
}

// Cập nhật AddressVibe theo addressId và vibeId
async function update(addressId, vibeId, newData) {
  try {
    const updated = await AddressVibe.update(newData, {
      where: { addressId, vibeId },
    });
    return updated;
  } catch (error) {
    throw new Error("Error updating AddressVibe: " + error.message);
  }
}

// Xoá AddressVibe theo addressId và vibeId
async function remove(addressId, vibeId) {
  try {
    const deleted = await AddressVibe.destroy({
      where: { addressId, vibeId },
    });
    return deleted;
  } catch (error) {
    throw new Error("Error deleting AddressVibe: " + error.message);
  }
}

// Export theo kiểu object thường
module.exports = {
  createAddressVibe,
  findAll,
  findOne,
  update,
  remove,
};
