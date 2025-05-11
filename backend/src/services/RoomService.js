const db = require("../models");
const { v4 } = require("uuid");
const { saveEmbedding } = require("./queryService");

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

const createRoom = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tạo Room với id tự sinh
      const room = await db.Room.create({
        id: v4(), // bạn có thể bỏ dòng này nếu Sequelize tự sinh
        name: data.name,
        idProperty: data.propertyId,
        maxPerson: data.maxPerson,
        price: data.price,
        status: data.status,
        quantity: data.quantity,
        code: data.code,
      });

      const roomId = room.id;

      const images = await db.ImageRoom.bulkCreate(
        data.images.map((item) => ({
          id: v4(),
          idRoom: roomId,
          image: item.image,
        }))
      );

      const amenities = await db.AmenityRoom.bulkCreate(
        data.amenities.map((item) => ({
          idRoom: roomId,
          idAmenity: item,
        }))
      );

      const summaries = await db.SummaryRoom.bulkCreate(
        data.summaries.map((item) => ({
          idRoom: roomId,
          idSummary: item,
        }))
      );

      // Gọi embedding sau khi tạo
      try {
        await embeddingRoom(roomId); // chỉ cần truyền id, bên trong tự fetch đầy đủ
      } catch (embeddingError) {
        console.error("⚠️ Failed to save embedding:", embeddingError);
      }

      resolve({
        status: "OK",
        data: room,
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: `Error creating room: ${error.message || error}`,
      });
    }
  });
};

const embeddingRoom = async (roomId) => {
  try {
    console.log("🔍 Embedding room with ID:", roomId);
    const getRoom = await getDetailById(roomId); // bạn cần định nghĩa hàm này
    console.log("🔍 Room details:", getRoom.data.dataValues);

    const dataRooms = {
      id: getRoom.data.dataValues.id,
      name: getRoom.data.dataValues.name,
      maxPerson: getRoom.data.dataValues.maxPerson,
      price: getRoom.data.dataValues.price,
      status: getRoom.data.dataValues.status,
      quantity: getRoom.data.dataValues.quantity,
      amenities: getRoom.data.dataValues.amenities.map((item) => ({
        id: item.id,
        name: item.name,
        icon: item.icon,
      })),
      images: getRoom.data.dataValues.images.map((item) => ({
        id: item.id,
        image: item.image,
      })),
      summaries: getRoom.data.dataValues.summaries.map((item) => ({
        id: item.id,
        name: item.name,
        icon: item.icon,
      })),
    };
    console.log("🔍 Data to be embedded:", dataRooms);

    const embeddingResult = await saveEmbedding("room", dataRooms);
    console.log("✅ Embedding result:", embeddingResult);
  } catch (err) {
    console.error("❌ Failed to perform embeddingRoom:", err.message || err);
  }
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
