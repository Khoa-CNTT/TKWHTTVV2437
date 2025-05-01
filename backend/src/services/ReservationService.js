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
        total,
        message = null,
        nameAccount,
        numberAccount,
        nameBank,
      } = data;
      console.log("data", data);
      const code = Math.floor(10000 + Math.random() * 90000).toString();

      const response = await db.Reservation.create({
        idUser: userId,
        idRoom: roomId,
        firstName,
        lastName,
        email,
        phone,
        imageBanking,
        message,
        nameAccount,
        numberAccount,
        nameBank,
        code,
        statusUser: "created",
        checkIndate: startDay,
        checkOutdate: endDay,
        totalPrice: total,
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

const listReservationApprove = ({ filter }) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("filter ", filter);
      let order;
      switch (filter) {
        case "latest":
          order = [["createdAt", "DESC"]];
          break;
        case "price-asc":
          order = [["totalPrice", "ASC"]];
          break;
        case "price-desc":
          order = [["totalPrice", "DESC"]];
          break;

        default:
          order = [["createdAt", "ASC"]];
          break;
      }

      const response = await db.Reservation.findAndCountAll({
        where: { status: "waiting" },
        include: [
          {
            model: db.Room,
            as: "rooms",
            attributes: ["name", "price"],
          },
        ],
        order,
      });

      resolve({
        status: response ? "OK" : "ERR",
        data: response,
      });
    } catch (error) {
      reject("error " + error);
    }
  });
};

const detailReservationApprove = (reid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.Reservation.findOne({
        where: {
          id: reid,
        },
        include: [
          {
            model: db.Room,
            as: "rooms",
            attributes: ["name", "price"],
          },
        ],
      });

      resolve({
        status: response?.dataValues ? "OK" : "ERR",
        data: response?.dataValues || null,
      });
    } catch (error) {
      reject("error " + error);
    }
  });
};

const approveReservation = ({ reid, status }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.Reservation.update(
        {
          status: status,
        },
        {
          where: {
            id: reid,
          },
        }
      );

      resolve({
        status: "OK",
        msg: "Approve reservation success!",
      });
    } catch (error) {
      reject("error " + error);
    }
  });
};
module.exports = {
  createReservation,
  listReservationApprove,
  detailReservationApprove,
  approveReservation,
};
