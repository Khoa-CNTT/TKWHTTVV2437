const { v4 } = require("uuid");
const db = require("../models");
const { fn, col } = require("sequelize");
const { saveEmbedding } = require("./queryService");
const { getDetailProperyById } = require("./PropertyService");
const { deleteCollection } = require("./collectionService");

const getRatingByPropertyId = (propertyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await db.Review.findOne({
        attributes: [
          // Tính trung bình rating và làm tròn đến 1 chữ số thập phân
          [
            fn("COALESCE", fn("ROUND", fn("AVG", col("rating")), 1), 0),
            "averageRating",
          ],
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

const createPropertyReview = (reviewData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { idUser, idProperty, rating, text } = reviewData;

      // Tạo một review mới
      const newReview = await db.Review.create({
        id: v4(),
        idUser,
        idProperty,
        rating,
        text,
        reviewDate: new Date(), // Ngày đánh giá
      });

      try {
        await embeddingReview(newReview.idProperty); // Gọi hàm embeddingRoom với idProperty
      } catch (err) {
        console.error(
          "❌ Failed to perform embeddingRoom:",
          err.message || err
        );
      }

      resolve({
        status: "OK",
        data: newReview,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const embeddingReview = async (id) => {
  try {
    const getProperty = await getDetailProperyById(id);
    const getReview = await getRatingByPropertyId(id);
    const dataReview = {
      id: getProperty.data.dataValues.name,
      propertyId: getProperty.data.dataValues.id,
      name: getProperty.data.dataValues.name,
      averageRating: getReview.data.dataValues.averageRating,
    };

    await deleteCollection(
      `reviewPeroperty_${getProperty.data.dataValues.name}`
    );

    const embeddingResult = await saveEmbedding("reviewPeroperty", dataReview);
    console.log("✅ Embedding result:", getReview);
  } catch (err) {
    console.error("❌ Failed to perform embeddingRoom:", err.message || err);
  }
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
  createPropertyReview,
  getRatingByPropertyId,
  getListReviewByProperyId,
};
