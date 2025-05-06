const db = require("../models");
const { fn, col, Op, where } = require("sequelize");
const { v4 } = require("uuid");
const slugify = require("slugify");
const hightlightProperty = require("../models/hightlightProperty");
const { saveEmbedding } = require("./queryService");
const { sequelize } = require("../models");
const moment = require("moment");
const reviewService = require("./ReviewService");

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
            attributes: ["id", "image"],
            limit: 1, // Fetch only the first image
            order: [["createdAt", "ASC"]], // Chỉ lấy các cột cần thiết từ ImageRoom
          },
          {
            model: db.Address,
            as: "propertyAddress", // Alias được định nghĩa trong `Room.associate`
            attributes: ["id", "city"], // Chỉ lấy các cột cần thiết từ ImageRoom
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
            required: true,
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

const getListProperty = (filter, limit = 12) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        minPrice,
        maxPrice,
        amenities,
        city,
        category,
        page = 1,
      } = filter;

      // Tính toán offset cho phân trang
      const offset = (page - 1) * limit;

      // Xây dựng điều kiện lọc
      const whereConditions = {};

      if (minPrice) {
        whereConditions["$rooms.price$"] = {
          [Op.gte]: parseFloat(minPrice), // Giá lớn hơn hoặc bằng
        };
      }

      if (maxPrice) {
        whereConditions["$rooms.price$"] = {
          ...whereConditions["$rooms.price$"],
          [Op.lte]: parseFloat(maxPrice), // Giá nhỏ hơn hoặc bằng
        };
      }

      // Điều kiện lọc theo city trong bảng Address
      const addressConditions = {};
      if (city) {
        addressConditions["slug"] = slugify(city, {
          lower: true, // chuyển thành chữ thường
          strict: true, // bỏ các ký tự đặc biệt
        }); // So sánh với cột city trong bảng Address
      }

      if (category) {
        whereConditions["idCategory"] = category; // Lọc theo danh mục
      }

      // Điều kiện lọc theo amenities
      // Điều kiện lọc theo amenities (chỉ lấy property có ít nhất tất cả amenities truyền vào)
      if (amenities && amenities.length > 0) {
        const amenityIds = amenities.split(",").map((id) => parseInt(id));

        whereConditions[Op.and] = amenityIds.map((id) => ({
          [Op.and]: [
            sequelize.literal(`EXISTS (
              SELECT 1 FROM \`AmenityProperties\` 
              WHERE \`AmenityProperties\`.\`idProperty\` = \`Property\`.\`id\`
              AND \`AmenityProperties\`.\`idAmenity\` = ${id}
            )`),
          ],
        }));
      }

      // const currentTime = new Date();

      const properties = await db.Property.findAndCountAll({
        where: whereConditions,
        attributes: {
          include: [
            [
              fn(
                "COALESCE",
                fn("ROUND", fn("AVG", col("reviews.rating")), 1),
                0
              ),
              "averageRating",
            ],
            [fn("COUNT", fn("DISTINCT", col("reviews.id"))), "reviewCount"],
            [fn("MIN", col("rooms.price")), "price"],
            // [
            //   sequelize.literal(`CASE
            //     WHEN expiredAd > '${currentTime.toISOString()}'
            //     THEN 1 ELSE 0
            //   END`),
            //   "isActiveAd",
            // ],
          ],
        },
        include: [
          {
            model: db.ImageProperty,
            as: "images",
            attributes: ["id", "image"],
            limit: 1,
            order: [["createdAt", "ASC"]],
          },
          {
            model: db.Address,
            as: "propertyAddress",
            attributes: ["id", "city", "slug"],
            where: addressConditions,
          },
          {
            model: db.Review,
            as: "reviews",
            attributes: [],
          },
          {
            model: db.Room,
            as: "rooms",
            attributes: [],
            required: true,
          },
          {
            model: db.Amenity,
            as: "amenities", // Alias được định nghĩa trong model
            attributes: ["id", "name"],
            through: { attributes: [] }, // Không lấy dữ liệu từ bảng trung gian
            // where: amenityConditions, // Áp dụng điều kiện lọc theo amenities
          },
        ],
        group: ["Property.id"],
        subQuery: false,
        order: [
          [
            sequelize.literal(`CASE 
              WHEN advertising > 0 AND expiredAd > NOW() THEN advertising 
              ELSE 0 
            END`),
            "DESC",
          ],
        ],
        limit,
        offset,
      });

      // Trả về kết quả với phân trang
      resolve({
        status: properties.rows.length > 0 ? "OK" : "ERR",
        data: properties.rows || [],
        pagination: {
          totalItems: properties.count.length,
          totalPages: Math.ceil(properties.count.length / limit),
          currentPage: page,
          pageSize: limit,
        },
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: `Error fetching properties: ${error.message || error}`,
      });
    }
  });
};

const getPropertyIdByUserId = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const property = await db.Property.findOne({
        where: { idUser: userId },
        attributes: ["id"],
      });

      resolve({
        status: property ? "OK" : "ERR",
        data: property || null,
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: `Error fetching properties: ${error.message || error}`,
      });
    }
  });
};

const getListSearchText = (text) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!text || typeof text !== "string") {
        return resolve({
          status: "ERR",
          data: [],
        });
      }

      const properties = await db.Property.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${text}%` } },
            { "$propertyAddress.city$": { [Op.like]: `%${text}%` } },
            { "$propertyAddress.country$": { [Op.like]: `%${text}%` } },
          ],
        },
        attributes: ["id", "name", "slug"],
        include: [
          {
            model: db.Address,
            as: "propertyAddress",
            attributes: ["id", "city", "slug", "country"],
            required: true, // Chỉ lấy properties có address
          },
        ],
        limit: 10, // Giới hạn kết quả trả về
      });

      resolve({
        status: properties.length > 0 ? "OK" : "ERR",
        data: properties || [],
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: `Error fetching properties: ${error.message || error}`,
      });
    }
  });
};

const createProperty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra dữ liệu đầu vào cơ bản
      if (!data.name || !data.description || !data.idUser || !data.categoryId) {
        return reject({
          status: "ERR",
          message: "Missing required property information",
        });
      }

      // Tạo property
      const property = await db.Property.create({
        id: v4(),
        name: data.name,
        description: data.description,
        idUser: data.userId,
        idCategory: data.categoryId,
        slug: slugify(data.name, {
          lower: true,
          strict: true,
        }),
      });

      // Tạo address
      const address = await db.Address.create({
        id: v4(),
        idProperty: property.id,
        street: data.street,
        district: data.district,
        city: data.city,
        country: data.country,
        slug: slugify(data.city, {
          lower: true, // chuyển thành chữ thường
          strict: true, // bỏ các ký tự đặc biệt
        }),
      });

      // Tạo images
      const images = await db.ImageProperty.bulkCreate(
        data.images.map((item) => ({
          id: item.id || v4(),
          idProperty: property.id,
          image: item.image,
        }))
      );

      const amenities = await db.AmenityProperty.bulkCreate(
        data.amenities.map((item) => ({
          idProperty: property.id,
          idAmenity: item,
        }))
      );

      const highlights = await db.HighlightProperty.bulkCreate(
        data.highlights.map((item) => ({
          idProperty: property.id,
          idHighlight: item,
        }))
      );

      const newdata = [
        { property: property },
        { address: address },
        { amenities: amenities },
        { highlights: highlights },
        { images: images },
      ];

      // Chuẩn bị dữ liệu cho embedding - FIX: Tạo đúng định dạng cho saveEmbedding
      const propertyData = {
        id: property.id,
        name: property.name,
        description: property.description,
        slug: property.slug,
        address: {
          street: address.street,
          district: address.district,
          city: address.city,
          country: address.country,
        },
        images: images.map((img) => ({
          id: img.id,
          image: img.image,
        })),
        amenities: amenities.map((am) => am.idAmenity),
        highlights: highlights.map((hl) => hl.idHighlight),
      };

      try {
        // Thực hiện embedding sau khi đã tạo dữ liệu - FIX: truyền đúng định dạng
        const embeddingResult = await saveEmbedding("hotel", propertyData);
        console.log("Embedding result:", embeddingResult);
      } catch (embeddingError) {
        console.error("Failed to save embedding:", embeddingError);
        // Vẫn tiếp tục để trả về dữ liệu đã tạo
      }

      console.log(
        "🚀 ~ file: PropertyService.js:1 ~ createProperty ~ embedding completed:",
        JSON.stringify(propertyData, null, 2)
      );

      // Trả về kết quả thành công
      resolve({
        status: "OK",
        data: propertyData,
      });
    } catch (error) {
      console.error("Property creation error:", error);

      reject({
        status: "ERR",
        message: `Error creating property: ${error.message || error}`,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  });
};

const updateProperty = (propertyId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Update the property details
      const property = await db.Property.update(
        {
          name: data.name,
          description: data.description,
          idUser: data.idUser,
          idCategory: data.categoryId,
          slug: slugify(data.name, {
            lower: true, // Convert to lowercase
            strict: true, // Remove special characters
          }),
        },
        { where: { id: propertyId } }
      );

      // Update the address
      const address = await db.Address.update(
        {
          street: data.street,
          district: data.district,
          city: data.city,
          country: data.country,
          slug: slugify(data.city, {
            lower: true, // chuyển thành chữ thường
            strict: true, // bỏ các ký tự đặc biệt
          }),
        },
        { where: { idProperty: propertyId } }
      );

      // Update images: Delete old ones and add new ones
      await db.ImageProperty.destroy({ where: { idProperty: propertyId } });
      const images = await db.ImageProperty.bulkCreate(
        data.images.map((item) => ({
          id: item.id,
          idProperty: propertyId,
          image: item.image,
        }))
      );

      // Update amenities: Delete old ones and add new ones
      await db.AmenityProperty.destroy({ where: { idProperty: propertyId } });
      const amenities = await db.AmenityProperty.bulkCreate(
        data.amenities.map((item) => ({
          idProperty: propertyId,
          idAmenity: item,
        }))
      );

      // Update highlights: Delete old ones and add new ones
      await db.HighlightProperty.destroy({ where: { idProperty: propertyId } });
      const highlights = await db.HighlightProperty.bulkCreate(
        data.highlights.map((item) => ({
          idProperty: propertyId,
          idHighlight: item,
        }))
      );

      const updatedData = {
        property,
        address,
        images,
        amenities,
        highlights,
      };

      resolve({
        status: "OK",
        data: updatedData,
      });
    } catch (error) {
      // Handle errors and provide detailed error messages
      reject({
        status: "ERR",
        message: `Error updating property: ${error.message || error}`,
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
            as: "images",
            attributes: ["id", "image"],
          },
          {
            model: db.Amenity,
            as: "amenities",
            through: { attributes: [] },
          },
          {
            model: db.Highlight,
            as: "highlights",
            through: { attributes: [] },
          },
          {
            model: db.Address,
            as: "propertyAddress",
          },
          {
            model: db.Room,
            as: "rooms",
            attributes: ["price"], // Remove individual room attributes since we're aggregating
          },
        ],
      });

      let price = property?.rooms[0].price;

      for (let i = 1; i < property?.rooms?.length; i++) {
        price = Math.min(price, property?.rooms[i].price);
      }

      // Gộp kết quả
      const result = {
        ...property.toJSON(),
        price,
      };

      resolve({
        status: result ? "OK" : "ERR",
        data: result || null,
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
          // {
          //   model: db.City,
          //   as: "city", // Alias được định nghĩa trong `Property.associate`
          //   attributes: ["name"], // Chỉ lấy cột "name" từ City
          // },
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
          {
            model: db.Address,
            as: "propertyAddress",
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

const getDetailProperyByUserId = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log({ userId });
      const property = await db.Property.findOne({
        where: { idUser: userId },
        include: [
          {
            model: db.ImageProperty,
            as: "images", // Alias được định nghĩa trong `property.associate`
            attributes: ["id", "image"], // Lấy tất cả các ảnh liên kết
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
          {
            model: db.Address,
            as: "propertyAddress",
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

const renewalAdByUserId = (userId, advertisingId, term, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      const property = await db.Property.findOne({ where: { idUser: userId } });

      if (property.expiredAd === null || property.expiredAd < moment()) {
        await db.Property.update(
          {
            idAdvertising: advertisingId,
            advertising: type,
            expiredAd: moment().add(term, "months"),
          },
          {
            where: { idUser: userId },
          }
        );
      } else {
        await db.Property.update(
          {
            idAdvertising: advertisingId,
            advertising: type,
            expiredAd: moment(property.expiredAd).add(term, "months"),
          },
          {
            where: { idUser: userId },
          }
        );
      }

      resolve({
        status: "OK",
        data: property || null,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getAdvertisingByPropertyId = async (propertyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const property = await db.Property.findOne({
        where: { id: propertyId },
        attributes: ["expiredAd", "advertising"],
        include: [
          {
            model: db.Advertising,
            as: "advertisingDetail",
            attributes: [
              "id",
              "name",
              "price",
              "term",
              "icon",
              "description",
              "type",
            ],
          },
        ],
      });

      console.log({ property });

      resolve({
        status: property ? "OK" : "ERR",
        data: property || null,
      });
    } catch (error) {
      console.error("Error fetching advertising by property ID:", error);
      reject(error);
    }
  });
};

const getTotalDashboard = async (propertyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalBooking = await db.Reservation.count({
        include: [
          {
            model: db.Room,
            where: { idProperty: propertyId },
            as: "rooms",
            required: true,
          },
        ],
      });

      const totalRoomType = await db.Room.count({
        where: { idProperty: propertyId },
      });

      // Thêm phần tính tổng số phòng từ bảng RoomType
      const totalRoom = await db.Room.sum("quantity", {
        where: { idProperty: propertyId },
      });

      const review = await reviewService.getRatingByPropertyId(propertyId);

      const total = {};
      total.totalBooking = totalBooking;
      total.totalRoomType = totalRoomType;
      total.totalRoom = totalRoom;
      total.review = review.data;

      resolve({
        status: totalBooking ? "OK" : "ERR",
        data: { ...total },
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
  updateProperty,
  getListProperty,
  getListSearchText,
  getDetailProperyByUserId,
  getPropertyIdByUserId,
  renewalAdByUserId,
  getAdvertisingByPropertyId,
  getTotalDashboard,
};
