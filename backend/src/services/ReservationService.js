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
        code,
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
        data: response,
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

const approveReservation = ({ reid, status, returnImgBanking }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.Reservation.update(
        {
          status: status,
          returnImgBanking: returnImgBanking,
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

const listReservationOfUser = (idUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = [["createdAt", "DESC"]];

      const response = await db.Reservation.findAndCountAll({
        where: { idUser: idUser },
        include: [
          {
            model: db.Room,
            as: "rooms",
            attributes: ["name", "price"],
            include: [
              {
                model: db.Property,
                as: "property",

                attributes: ["id", "address", "name"],
                include: [
                  {
                    model: db.Address,
                    as: "propertyAddress",

                    attributes: {
                      exclude: ["id", "idProperty", "createdAt", "updatedAt"],
                    },
                  },
                  {
                    model: db.ImageProperty,
                    as: "images", // alias này cần đúng với định nghĩa trong model
                    attributes: ["id", "image", "idProperty"],
                  },
                ],
              },
              // {
              //   model: db.ImageRoom,

              //   as: "images", // alias này cần đúng với định nghĩa trong model
              //   attributes: ["id", "image", "idRoom"],
              // },
            ],
          },
        ],
        order,
        distinct: true,
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

const detailReservationOfUser = (idRes) => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = [["createdAt", "DESC"]];

      const response = await db.Reservation.findOne({
        where: { id: idRes },
        include: [
          {
            model: db.Room,
            as: "rooms",
            attributes: ["name", "price"],
            include: [
              {
                model: db.Property,
                as: "property",

                attributes: ["id", "address", "name"],
                include: [
                  {
                    model: db.Address,
                    as: "propertyAddress",

                    attributes: {
                      exclude: ["id", "idProperty", "createdAt", "updatedAt"],
                    },
                  },
                  {
                    model: db.ImageProperty,
                    as: "images", // alias này cần đúng với định nghĩa trong model
                    attributes: ["id", "image", "idProperty"],
                  },
                ],
              },
              {
                model: db.ImageRoom,

                as: "images", // alias này cần đúng với định nghĩa trong model
                attributes: ["id", "image", "idRoom"],
              },
            ],
          },
        ],
        order,
        distinct: true,
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

const updateInfoReservation = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id, ...payload } = data;
      const response = await db.Reservation.update(
        {
          ...payload,
        },
        {
          where: {
            id: id,
          },
        }
      );

      resolve({
        status: "OK",
        msg: "Update reservation success!",
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
  listReservationOfUser,
  detailReservationOfUser,
  updateInfoReservation,
};
