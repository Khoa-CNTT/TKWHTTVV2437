const db = require("../models");
const { fn, col } = require("sequelize");

const getRatingByPropertyId = (propertyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await db.Review.findOne({
        attributes: [
          // Tính trung bình rating và làm tròn đến 1 chữ số thập phân
          [fn("ROUND", fn("AVG", col("rating")), 1), "averageRating"],
          // Đếm số lượng review
          [fn("COUNT", col("id")), "reviewCount"],
        ],
        where: { idProperty: propertyId }, // Điều kiện để lấy review của phòng cụ thể
      });

      resolve({
        status: result ? "OK" : "ERR",
        data: result || [],
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getRatingByPropertyId,
};
