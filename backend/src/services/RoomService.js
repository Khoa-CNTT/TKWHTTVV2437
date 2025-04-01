const db = require("../models");
const { fn, col } = require("sequelize");

const listTop10Room = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const rooms = await db.Room.findAll({
        attributes: {
          include: [
            // Tính trung bình điểm rating và làm tròn đến 1 chữ số thập phân
            [fn("ROUND", fn("AVG", col("reviews.rating")), 1), "averageRating"],
            [fn("COUNT", col("reviews.id")), "reviewCount"],
          ],
        },
        include: [
          {
            model: db.ImageRoom,
            as: "images", // Alias được định nghĩa trong `Room.associate`
            attributes: ["id", "image"], // Chỉ lấy các cột cần thiết từ ImageRoom
          },
          {
            model: db.Property,
            as: "property",
            attributes: ["id", "name"], // Chỉ lấy các cột cần thiết từ Property
            include: [
              {
                model: db.City,
                as: "city", // Alias được định nghĩa trong `Property.associate`
                attributes: ["name"], // Chỉ lấy cột "name" từ City
              },
            ],
          },
          {
            model: db.Review,
            as: "reviews", // Alias được định nghĩa trong `Room.associate`
            attributes: [], // Không lấy các cột từ bảng Review
          },
        ],
        group: ["Room.id", "images.id", "property.id", "property->city.id"], // Nhóm theo Room và các bảng liên kết
        order: [[fn("AVG", col("reviews.rating")), "DESC"]], // Sắp xếp theo điểm trung bình giảm dần
        subQuery: false,
        limit: 10, // Giới hạn kết quả trả về là 10 bản ghi
      });

      resolve({
        status: rooms.length > 0 ? "OK" : "ERR",
        data: rooms || [],
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getDetailRoomById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const room = await db.Room.find({
        where: { id },
        attributes: {
          include: [
            // Tính trung bình điểm rating và làm tròn đến 1 chữ số thập phân
            [fn("ROUND", fn("AVG", col("reviews.rating")), 1), "averageRating"],
            [fn("COUNT", col("reviews.id")), "reviewCount"],
          ],
        },
        include: [
          {
            model: db.ImageRoom,
            as: "images", // Alias được định nghĩa trong `Room.associate`
            attributes: ["id", "image"], // Chỉ lấy các cột cần thiết từ ImageRoom
          },
          {
            model: db.Property,
            as: "property",
            attributes: ["id", "name"], // Chỉ lấy các cột cần thiết từ Property
            include: [
              {
                model: db.City,
                as: "city", // Alias được định nghĩa trong `Property.associate`
                attributes: ["name"], // Chỉ lấy cột "name" từ City
              },
            ],
          },
          {
            model: db.Review,
            as: "reviews", // Alias được định nghĩa trong `Room.associate`
            attributes: [], // Không lấy các cột từ bảng Review
          },
        ],
        group: ["Room.id", "images.id", "property.id", "property->city.id"], // Nhóm theo Room và các bảng liên kết
      });

      resolve({
        status: room ? "OK" : "ERR",
        data: room || [],
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  listTop10Room,
  getDetailRoomById,
};
