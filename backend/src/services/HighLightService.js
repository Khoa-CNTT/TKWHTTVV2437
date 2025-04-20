const db = require("../models");

const getAllList = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const highlights = await db.Highlight.findAll({
        attributes: ["id", "name", "icon", "description"],
      });

      resolve({
        status: highlights.length > 0 ? "OK" : "ERR",
        data: highlights || [],
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllList,
};
