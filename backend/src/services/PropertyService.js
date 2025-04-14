const db = require("../models");
const { fn, col } = require("sequelize");

const listTop10HomestayRating = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const properties = await db.Property.findAll({
        attributes: {
          include: [
            // Tính trung bình điểm rating và làm tròn đến 1 chữ số thập phân
            [
              fn(
                "COALESCE",
                fn("ROUND", fn("AVG", col("reviews.rating")), 1),
                0
              ),
              "averageRating",
            ],
            [
              fn("COUNT", fn("DISTINCT", col("reviews.id"))), // Đếm các reviews.id duy nhất
              "reviewCount",
            ],
            [
              fn("MIN", col("rooms.price")), // Tính giá trị nhỏ nhất của cột price từ bảng Room
              "price",
            ],
          ],
        },
        include: [
          {
            model: db.ImageProperty,
            as: "images", // Alias được định nghĩa trong `Room.associate`
            attributes: ["id", "image"], // Chỉ lấy các cột cần thiết từ ImageRoom
          },
          {
            model: db.City,
            as: "city", // Alias được định nghĩa trong `Room.associate`
            attributes: ["id", "name"], // Chỉ lấy các cột cần thiết từ ImageRoom
          },
          {
            model: db.Review,
            as: "reviews", // Alias được định nghĩa trong `Room.associate`
            attributes: [], // Không lấy các cột từ bảng Review
          },
          {
            model: db.Room,
            as: "rooms", // Alias được định nghĩa trong `Room.associate`
            attributes: [], // Không lấy các cột từ bảng Review
          },
        ],
        group: ["Property.id"], // Nhóm theo Room và các bảng liên kết
        order: [[fn("AVG", col("reviews.rating")), "DESC"]], // Sắp xếp theo điểm trung bình giảm dần
        subQuery: false,
        limit: 10,
      });

      resolve({
        status: properties.length > 0 ? "OK" : "ERR",
        data: properties || [],
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getDetailBySlug = (slug) => {
  return new Promise(async (resolve, reject) => {
    try {
      const property = await db.Property.findOne({
        where: { slug },
        include: [
          {
            model: db.ImageProperty,
            as: "images", // Alias được định nghĩa trong `Room.associate`
            attributes: ["id", "image"], // Lấy tất cả các ảnh liên kết
          },
          {
            model: db.City,
            as: "city", // Alias được định nghĩa trong `Property.associate`
            attributes: ["name"], // Chỉ lấy cột "name" từ City
          },
          {
            model: db.Amenity,
            as: "amenities", // Alias được định nghĩa trong Room.associate
          },
        ],
      });

      resolve({
        status: property ? "OK" : "ERR",
        data: property || null,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getDetailRoomById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const room = await db.Room.findOne({
        where: { id },
        include: [
          {
            model: db.ImageRoom,
            as: "images", // Alias được định nghĩa trong `Room.associate`
            attributes: ["id", "image"], // Lấy tất cả các ảnh liên kết
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
        ],
        attributes: ["name", "price"],
      });

      resolve({
        status: room ? "OK" : "ERR",
        data: room || null,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  listTop10HomestayRating,
  getDetailBySlug,
  getDetailRoomById,
};
