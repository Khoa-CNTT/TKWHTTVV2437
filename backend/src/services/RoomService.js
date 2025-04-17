const db = require("../models");

const getListRoomByPropertyId = (propertyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const rooms = await db.Room.findAll({
        where: { idProperty: propertyId },
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
      const rooms = await db.Room.findOne({
        where: { id: roomId },
        attributes: ["name", "price", "maxPerson"],
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

const createRoom = (data, propertdId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const property = await db.Property.findOne({
        where: { id: propertdId },
      });
      // Kiểm tra xem phòng đã tồn tại chưa
      const existingRoom = await db.Room.findOne({
        where: { name: data.name, idProperty: data.idProperty },
      });
      const room = await db.Room.create({
        name: data.name,
        price: data.price,
        maxPerson: data.maxPerson,
        idProperty: data.idProperty,
      });

      const data_embeddings = {
        propertyName: property.name,
        name: room.name,
        price: room.price,
        maxPerson: room.maxPerson,
        amenities: room.amenities,
      };
      const embedding = await generateEmbeddings("rooms", data_embeddings);
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
  getListRoomByPropertyId,
  getDetailById,
};
