const db = require("../models");
const { v4 } = require("uuid");

const getListRoomByPropertyId = (propertyId, filters = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { text, status } = filters;

      const rooms = await db.Room.findAll({
        where: {
          idProperty: propertyId,
          ...(text && {
            [db.Sequelize.Op.or]: [
              { name: { [db.Sequelize.Op.like]: `%${text}%` } }, // Tìm kiếm theo tên
              { code: { [db.Sequelize.Op.like]: `%${text}%` } }, // Tìm kiếm theo mã
            ],
          }),
          ...(status && { status }), // Tìm kiếm theo trạng thái
        },
        include: [
          {
            model: db.Amenity,
            as: "amenities", // Alias được định nghĩa trong Room.associate
            attributes: ["name", "icon"],
            through: { attributes: [] },
          },
          {
            model: db.ImageRoom,
            as: "images",
            attributes: ["id", "image"],
          },
          {
            model: db.Summary,
            as: "summaries", // Alias được định nghĩa trong Room.associate
            attributes: ["name", "icon"],
            through: { attributes: [] },
          },
        ],
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

const searchListRoomForBooking = (propertyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const rooms = await db.Room.findAll({
        where: { idProperty: propertyId, status: "active" },
        include: [
          {
            model: db.Amenity,
            as: "amenities", // Alias được định nghĩa trong Room.associate
            attributes: ["name", "icon"],
            through: { attributes: [] },
          },
          {
            model: db.ImageRoom,
            as: "images",
            attributes: ["id", "image"],
          },
          {
            model: db.Summary,
            as: "summaries", // Alias được định nghĩa trong Room.associate
            attributes: ["name", "icon"],
            through: { attributes: [] },
          },
        ],
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

const getDetailById = (roomId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const room = await db.Room.findOne({
        where: { id: roomId },
        include: [
          {
            model: db.ImageRoom,
            as: "images", // Alias được định nghĩa trong `property.associate`
            attributes: ["id", "image"], // Lấy tất cả các ảnh liên kết
          },
          {
            model: db.Amenity,
            as: "amenities", // Alias được định nghĩa trong Room.associate
            attributes: ["name", "id", "icon"],
            through: { attributes: [] },
          },
          {
            model: db.Summary,
            as: "summaries",
            through: { attributes: [] },
          },
        ],
      });

      resolve({
        status: room ? "OK" : "ERR",
        data: room,
      });
    } catch (error) {
      reject(error);
    }
  });
};

// const createRoom = (data, propertdId) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const property = await db.Property.findOne({
//         where: { id: propertdId },
//       });
//       // Kiểm tra xem phòng đã tồn tại chưa
//       const existingRoom = await db.Room.findOne({
//         where: { name: data.name, idProperty: data.idProperty },
//       });
//       const room = await db.Room.create({
//         name: data.name,
//         price: data.price,
//         maxPerson: data.maxPerson,
//         idProperty: data.idProperty,
//       });

//       const data_embeddings = {
//         propertyName: property.name,
//         name: room.name,
//         price: room.price,
//         maxPerson: room.maxPerson,
//         amenities: room.amenities,
//       };
//       const embedding = await generateEmbeddings("rooms", data_embeddings);
//       resolve({
//         status: room ? "OK" : "ERR",
//         data: room || null,
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

const createRoom = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const room = await db.Room.create({
        id: v4(),
        name: data.name,
        idProperty: data.propertyId,
        maxPerson: data.maxPerson,
        price: data.price,
        status: data.status,
        quantity: data.quantity,
        code: data.code,
      });

      const images = await db.ImageRoom.bulkCreate(
        data.images.map((item) => ({
          id: item.id,
          idRoom: room.id,
          image: item.image,
        }))
      );

      const amenities = await db.AmenityRoom.bulkCreate(
        data.amenities.map((item) => ({
          idRoom: room.id,
          idAmenity: item,
        }))
      );

      const summaries = await db.SummaryRoom.bulkCreate(
        data.summaries.map((item) => ({
          idRoom: room.id,
          idSummary: item,
        }))
      );

      const newdata = [
        { room: room },
        { amenities: amenities },
        { images: images },
        { summaries: summaries },
      ];

      resolve({
        status: "OK",
        data: newdata,
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

const updateRoom = (roomId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const room = await db.Room.update(
        {
          name: data.name,
          maxPerson: data.maxPerson,
          price: data.price,
          status: data.status,
          quantity: data.quantity,
          code: data.code,
        },
        { where: { id: roomId } }
      );

      await db.ImageRoom.destroy({ where: { idRoom: roomId } });
      const images = await db.ImageRoom.bulkCreate(
        data.images.map((item) => ({
          id: item.id,
          idRoom: roomId,
          image: item.image,
        }))
      );

      await db.AmenityRoom.destroy({ where: { idRoom: roomId } });
      const amenities = await db.AmenityRoom.bulkCreate(
        data.amenities.map((item) => ({
          idRoom: roomId,
          idAmenity: item,
        }))
      );

      await db.SummaryRoom.destroy({ where: { idRoom: roomId } });
      const summaries = await db.SummaryRoom.bulkCreate(
        data.summaries.map((item) => ({
          idRoom: roomId,
          idSummary: item,
        }))
      );

      const newdata = [
        { room: room },
        { amenities: amenities },
        { images: images },
        { summaries: summaries },
      ];

      resolve({
        status: "OK",
        data: newdata,
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

const updateStatusRoom = (roomId, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      const room = await db.Room.update(
        {
          status: status,
        },
        { where: { id: roomId } }
      );

      resolve({
        status: "OK",
        data: room,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getTopReventRoomByPropertyId = async (propertyId) => {
  try {
    // Bước 1: Lấy rooms với revenue
    const rooms = await db.Room.findAll({
      where: { idProperty: propertyId },
      attributes: [
        "id",
        "name",
        "price",
        "code",
        [
          db.sequelize.fn("SUM", db.sequelize.col("reservations.totalPrice")),
          "revenue",
        ],
        [
          db.sequelize.fn("COUNT", db.sequelize.col("reservations.id")),
          "reservationCount",
        ],
      ],
      include: [
        {
          model: db.Reservation,
          as: "reservations",
          attributes: [],
          required: false,
          where: {
            status: "confirmed",
          },
        },
      ],
      group: ["Room.id"],
      order: [[db.sequelize.literal("revenue"), "DESC"]],
    });

    // Bước 2: Lấy ảnh cho từng room
    const roomIds = rooms.map((room) => room.id);
    const images = await db.ImageRoom.findAll({
      where: { idRoom: roomIds },
      attributes: ["id", "image", "idRoom"],
    });

    // Gộp dữ liệu
    const roomsWithImages = rooms.map((room) => ({
      ...room.get({ plain: true }),
      images: images.filter((img) => img.idRoom === room.id),
    }));

    return {
      status: "OK",
      data: roomsWithImages,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getListRoomByPropertyId,
  getDetailById,
  createRoom,
  updateRoom,
  searchListRoomForBooking,
  updateStatusRoom,
  getTopReventRoomByPropertyId,
};
