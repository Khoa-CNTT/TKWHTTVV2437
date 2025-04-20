const db = require("../models");
const { fn, col, where } = require("sequelize");
const { generateEmbeddings } = require("./AIService");
const { v4 } = require("uuid");

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

const createProperty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const property = await db.Property.create({
        ...data,
        id: v4(),
        name: data.name,
        description: data.description,
        idUser: data.idUser,
        idCategory: data.idCategory,
      });

      resolve({
        status: "OK",
        data: property,
      });
    } catch (error) {
      // Ném lỗi có thông tin chi tiết về lỗi
      reject({
        status: "ERR",
        message: `Error creating property: ${error.message || error}`, // Cung cấp thông tin lỗi chi tiết hơn
      });
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

const getDetailProperyById = (propertyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const property = await db.Property.findOne({
        where: { id: propertyId },
        include: [
          {
            model: db.ImageProperty,
            as: "images", // Alias được định nghĩa trong `property.associate`
            attributes: ["id", "image"], // Lấy tất cả các ảnh liên kết
          },
          {
            model: db.City,
            as: "city", // Alias được định nghĩa trong `Property.associate`
            attributes: ["name"], // Chỉ lấy cột "name" từ City
          },
          {
            model: db.Address,
            as: "propertyAddress", // Alias được định nghĩa trong Room.associate
            attributes: ["street", "district", "ward", "country", "id", "city"],
          },
          {
            model: db.Highlight,
            as: "highlights", // Alias được định nghĩa trong Room.associate
            attributes: ["name", "id", "icon", "description"],
            through: { attributes: [] },
          },
          {
            model: db.Amenity,
            as: "amenities", // Alias được định nghĩa trong Room.associate
            attributes: ["name", "id", "icon"],
            through: { attributes: [] },
          },
        ],
        // attributes: ["name"],
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

const fetchFullData = async (filters = {}) => {
  try {
    const properties = await db.Property.findAll({
      attributes: ["name", "description", "address", "slug"],
      where: {
        ...(filters.name && {
          name: { [Op.iLike]: `%${filters.name}%` },
        }),
        ...(filters.address && {
          address: { [Op.iLike]: `%${filters.address}%` },
        }),
      },
      include: [
        {
          association: "rooms",
          attributes: ["name", "description", "price", "maxPerson"],
          where: filters.roomStatus
            ? { status: filters.roomStatus }
            : undefined,
        },
        {
          association: "images",
          attributes: ["image"],
        },
        {
          association: "reviews",
          attributes: ["text", "rating"],
        },
        {
          association: "amenities",
          attributes: ["name"],
          where:
            filters.amenities && filters.amenities.length
              ? {
                  name: {
                    [Op.in]: filters.amenities,
                  },
                }
              : undefined,
        },
      ],
    });

    // Chuyển đổi sang text
    const result = properties.map((property) => {
      const roomDescriptions = property.rooms
        ?.map((room) => {
          return `Room name: ${room.name}, Price: ${room.price}, Max person: ${
            room.maxPerson
          }, Description: ${room.description || "No description"}`;
        })
        .join("\n");

      const imageDescriptions = property.images
        ?.map((image) => `Image URL: ${image.image}`)
        .join("\n");

      const reviewTexts = property.reviews
        ?.map((review) => `Review: ${review.text}, Rating: ${review.rating}`)
        .join("\n");

      const amenities = property.amenities
        ?.map((amenity) => `Amenity: ${amenity.name}`)
        .join("\n");

      return {
        name: property.name,
        description: property.description,
        address: property.address,
        rooms: roomDescriptions,
        images: imageDescriptions,
        reviews: reviewTexts,
        amenities: amenities,
      };
    });

    return result;
  } catch (error) {
    console.error("Error in fetchFullData:", error);
    throw error;
  }
};
console.log(
  "🚀 ~ file: PropertyService.js:1 ~ fetchFullData ~ fetchFullData:",
  fetchFullData
);

const getListAmenityByPropertyId = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const amenities = await db.Property.findOne({
        where: { id },
        attributes: ["id"],
        include: [
          {
            model: db.Amenity,
            as: "amenities",
            attributes: ["id", "name", "icon"],
          },
        ],
      });

      resolve({
        status: amenities.length > 0 ? "OK" : "ERR",
        data: amenities || [],
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getListHightlightByPropertyId = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const highlights = await db.Property.findOne({
        where: { id },
        attributes: ["id"],
        include: [
          {
            model: db.Highlight,
            as: "highlights",
            attributes: ["id", "name", "icon", "description"],
            through: { attributes: [] },
          },
        ],
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
  listTop10HomestayRating,
  getDetailBySlug,
  getDetailProperyById,
  fetchFullData,
  createProperty,
  getListAmenityByPropertyId,
  getListHightlightByPropertyId,
};
