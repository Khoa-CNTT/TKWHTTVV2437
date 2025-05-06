const db = require("../models");

const getListAdvertising = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const advertising = await db.Advertising.findAll({
        limit: 9,
      });

      resolve({
        status: advertising.length > 0 ? "OK" : "ERR",
        data: advertising || [],
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getListAdvertising,
};
