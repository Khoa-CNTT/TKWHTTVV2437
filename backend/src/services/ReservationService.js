const db = require("../models");
import { v4 } from "uuid";
const createReservation = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        userId,
        email,
        phone,
        firstName,
        lastName,
        startDay,
        endDay,
        roomId,
        imageBanking,
      } = data;
      console.log("data", data);

      const response = await db.Reservation.create({
        idUser: userId,
        idRoom: roomId,
        firstName,
        lastName,
        email,
        phone,
        imageBanking,
        checkIndate: startDay,
        checkOutdate: endDay,
        status: "waiting",
        id: v4(),
      });

      resolve({
        status: "OK",
        message: "Create success",
      });
    } catch (error) {
      reject("error " + error);
    }
  });
};

module.exports = {
  createReservation,
};
