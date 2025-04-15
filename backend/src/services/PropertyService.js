const db = require("../models");
const { createAddress } = require("./AddressService");
const { createAddressVibe } = require("./AddressVibeService");
import { v4 } from "uuid";

const createProperty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("Creating property with data:", req.body);

      // Tạo Property trước
      const property = await db.Property.create({
        id: v4(),
        name: data.name,
        description: data.description,
        idUser: data.idUser,
      });

      console.log(property, "property");

      // Nếu có thông tin address, tạo address với propertyId chính là id của property
      if (data.address) {
        const addressData = {
          ...data.address,
          propertyId: property.id, // Đặt propertyId vào dữ liệu address
        };

        const address = await createAddress(addressData);
      }

      // Lấy property với address đã liên kết để trả về
      // const propertyWithAddress = await db.Property.findByPk(property.id, {
      //   include: [{ model: db.Address, as: "address" }],
      // });

      resolve({
        status: "OK",
        data: property,
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: `Error creating property: ${error.message}`,
      });
    }
  });
};
const getAllProperties = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const properties = await db.Property.findAll({
        include: [
          { model: db.Address, as: "address" }, // Bao gồm mối quan hệ với Address
          { model: db.Vibe, as: "vibe" }, // Bao gồm mối quan hệ với Vibe
        ],
      });
      resolve({
        status: properties.length > 0 ? "OK" : "ERR",
        data: properties || [],
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: `Error fetching properties: ${error.message}`,
      });
    }
  });
};

const getPropertyById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const property = await db.Property.findByPk(id, {
        include: [
          { model: db.Address, as: "address" }, // Bao gồm mối quan hệ với Address
          { model: db.Vibe, as: "vibe" }, // Bao gồm mối quan hệ với Vibe
        ],
      });
      if (!property) {
        resolve({
          status: "ERR",
          message: "Property not found",
        });
      } else {
        resolve({
          status: "OK",
          data: property,
        });
      }
    } catch (error) {
      reject({
        status: "ERR",
        message: `Error fetching property: ${error.message}`,
      });
    }
  });
};

const updateProperty = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const property = await db.Property.findByPk(id); // Tìm Property theo ID
      if (!property) {
        resolve({
          status: "ERR",
          message: "Property not found",
        });
      } else {
        await property.update(data);

        resolve({
          status: "OK",
          data: property,
        });
      }
    } catch (error) {
      reject({
        status: "ERR",
        message: `Error updating property: ${error.message}`,
      });
    }
  });
};

const deleteProperty = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const property = await db.Property.findByPk(id); // Tìm Property theo ID
      if (!property) {
        resolve({
          status: "ERR",
          message: "Property not found",
        });
      } else {
        await property.destroy(); // Xóa Property
        resolve({
          status: "OK",
          message: "Property deleted successfully",
        });
      }
    } catch (error) {
      reject({
        status: "ERR",
        message: `Error deleting property: ${error.message}`,
      });
    }
  });
};

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
