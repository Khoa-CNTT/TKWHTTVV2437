const db = require("../models");

const getAllList = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const summaries = await db.Summary.findAll();

      resolve({
        status: summaries.length > 0 ? "OK" : "ERR",
        data: summaries || [],
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllList,
};
