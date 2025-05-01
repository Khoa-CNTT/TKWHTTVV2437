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

const getListReviewByProperyId = (propertyId, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        limit = 10,
        page = 1,
        sortBy = "rating",
        order = "desc",
      } = filter;
      // Tính toán offset cho phân trang
      const offset = (page - 1) * limit;

      const result = await db.Review.findAndCountAll({
        where: { idProperty: propertyId }, // Điều kiện để lấy review của phòng cụ thể
        attributes: ["id", "rating", "text", "reviewDate", "createdAt"],
        include: [
          {
            model: db.User,
            attributes: ["firstName", "lastName", "avatar"],
            as: "user",
          },
        ],
        limit, // Số lượng review trên mỗi trang
        offset, // Vị trí bắt đầu lấy dữ liệu
        order: [[sortBy, order]],
      });

      resolve({
        status: result.rows.length > 0 ? "OK" : "ERR",
        data: result.rows || [],
        pagination: {
          totalItems: result.count,
          totalPages: Math.ceil(result.count / limit),
          currentPage: page,
          pageSize: limit,
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getRatingByPropertyId,
  getListReviewByProperyId,
};
