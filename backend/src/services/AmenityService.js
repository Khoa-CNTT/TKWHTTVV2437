const db = require("../models");

const getAllList = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const amenities = await db.Amenity.findAll();

      resolve({
        status: amenities.length > 0 ? "OK" : "ERR",
        data: amenities || [],
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllList,
};
