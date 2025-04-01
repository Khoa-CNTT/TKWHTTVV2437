const db = require("../models");

const listTop10City = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const citys = await db.City.findAll({
        limit: 10,
      });

      resolve({
        status: citys.length > 0 ? "OK" : "ERR",
        data: citys || [],
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  listTop10City,
};
