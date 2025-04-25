const db = require("../models");

const checkRoomAvailabilityByPropertyId = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { propertyId, startDate, endDate} = data;

      startDate = new Date(startDate);
      endDate = new Date(endDate);

      const property = await db.Property.findOne({
        where: {id: propertyId},
        attributes: ["id"],
        include: [
          {
            model: db.Room,
            as: "rooms", // Alias được định nghĩa trong Room.associate
            attributes: ["id", "quantity"],
          },
        ],
      });

      function getDatesInRange(startDate, endDate) {
        const date = new Date(startDate);
        const dates = [];
    
        while (date <= endDate) {
            dates.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }

        return dates;
      }

      const dateList = await getDatesInRange(startDate, endDate);

      // list room
      const rooms = await property.rooms.map((item) => ({id: item.id, quantity: item.quantity, status: true}));

      const handleCheck = async (dateList, rooms) => {
        for (const date of dateList) {
          for (const [indexRoom, room] of rooms.entries()) {
            const roomAvailability = await db.RoomAvailability.findOne({
              where: {
                idRoom: room.id,
                date: date.toISOString().split("T")[0], // Convert to 'YYYY-MM-DD' format
              },
            });
      
            if (roomAvailability) {
              if (roomAvailability.blocked_quantity >= room.quantity) {
                rooms[indexRoom].status = false;
              }
            }
          }
        }
      };

      await handleCheck(dateList, rooms);

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
  checkRoomAvailabilityByPropertyId
};
