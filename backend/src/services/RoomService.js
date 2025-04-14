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

module.exports = {
  getListRoomByPropertyId,
};
