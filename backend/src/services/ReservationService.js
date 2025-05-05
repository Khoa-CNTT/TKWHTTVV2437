const db = require("../models");
import { v4 } from "uuid";
import moment from "moment";
import { Op } from "sequelize";

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
            attributes: ["name", "deposit", "price"],
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
            attributes: ["name", "deposit", "price"],
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

const getDataBarChart = async (propertyId, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { type } = filter;

      const labels = [];
      const data = [];
      if (type === "month") {
        for (let i = 11; i >= 0; i--) {
          const month = moment().subtract(i, "months"); // Define month here

          labels.push(month.format("MM/YYYY"));
          const result = await db.Reservation.findOne({
            attributes: [
              [db.Sequelize.fn("SUM", db.Sequelize.col("totalPrice")), "total"],
            ],
            where: {
              checkInDate: {
                [Op.between]: [
                  month.startOf("month").toDate(),
                  month.endOf("month").toDate(),
                ],
              },
            },
            include: [
              {
                model: db.Room,
                where: { idProperty: propertyId },
                as: "rooms",
                required: true,
              },
            ],
          });

          data.push(result ? parseFloat(result.get("total")) || 0 : 0);
        }
      } else if (type === "quarter") {
        for (let i = 7; i >= 0; i--) {
          const quarter = moment().subtract(i, "quarters"); // Define quarter here

          labels.push(quarter.format("Q/YYYY"));
          const result = await db.Reservation.findOne({
            attributes: [
              [db.Sequelize.fn("SUM", db.Sequelize.col("totalPrice")), "total"],
            ],
            where: {
              checkInDate: {
                [Op.between]: [
                  quarter.startOf("quarter").toDate(),
                  quarter.endOf("quarter").toDate(),
                ],
              },
            },
            include: [
              {
                model: db.Room,
                where: { idProperty: propertyId },
                as: "rooms",
                required: true,
              },
            ],
          });

          data.push(result ? parseFloat(result.get("total")) || 0 : 0);
        }
      } else if (type === "year") {
        for (let i = 9; i >= 0; i--) {
          const year = moment().subtract(i, "years"); // Define year here

          labels.push(year.format("YYYY"));
          const result = await db.Reservation.findOne({
            attributes: [
              [db.Sequelize.fn("SUM", db.Sequelize.col("totalPrice")), "total"],
            ],
            where: {
              checkInDate: {
                [Op.between]: [
                  year.startOf("year").toDate(),
                  year.endOf("year").toDate(),
                ],
              },
            },
            include: [
              {
                model: db.Room,
                where: { idProperty: propertyId },
                as: "rooms",
                required: true,
              },
            ],
          });

          data.push(result ? parseFloat(result.get("total")) || 0 : 0);
        }
      }

      resolve({
        status: data ? "OK" : "ERR",
        data: { labels, data },
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createReservation,
  listReservationApprove,
  detailReservationApprove,
  approveReservation,
  getDataBarChart,
};
