const { status } = require("../controllers/AIController");
const db = require("../models");
const { v4 } = require("uuid");
const Op = require("sequelize").Op;
const moment = require("moment");

const createAdOrder = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { amount, idAdvertising, idUser, methodPay, quantity, idProperty } =
        data;
      console.log({ idProperty });
      const adOrder = await db.AdOrder.create({
        id: v4(),
        amount: amount,
        idAdvertising: idAdvertising,
        idUser: idUser,
        methodPay: methodPay,
        quantity: quantity,
        idProperty: idProperty,
      });

      resolve({
        status: adOrder ? "OK" : "ERR",
        data: adOrder || null,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateStatusAdOrder = (id, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      const adOrder = await db.AdOrder.findByPk(id); // Tìm AdOrder theo ID
      if (!adOrder) {
        resolve({
          status: "ERR",
          message: "AdOrder not found",
        });
      } else {
        await adOrder.update({ status: status }); // Cập nhật AdOrder
        resolve({
          status: "OK",
          data: adOrder,
        });
      }
    } catch (error) {
      reject({
        status: "ERR",
        message: `Error updating AdOrder: ${error.message}`,
      });
    }
  });
};

const getDataBarChartAdmin = async (filter) => {
  try {
    const { type } = filter;

    const labels = [];
    const data = [];

    if (type === "month") {
      for (let i = 11; i >= 0; i--) {
        const month = moment().subtract(i, "months");
        labels.push(month.format("MM/YYYY"));
        const result = await db.AdOrder.findOne({
          attributes: [
            [db.Sequelize.fn("SUM", db.Sequelize.col("amount")), "total"],
          ],
          where: {
            createdAt: {
              [Op.between]: [
                month.startOf("month").toDate(),
                month.endOf("month").toDate(),
              ],
            },
            status: "done",
          },
        });
        data.push(result ? parseFloat(result.get("total")) || 0 : 0);
      }
    } else if (type === "quarter") {
      for (let i = 11; i >= 0; i--) {
        const quarter = moment().subtract(i, "quarters");
        labels.push(`${quarter.quarter()}/${quarter.year()}`);
        const result = await db.AdOrder.findOne({
          attributes: [
            [db.Sequelize.fn("SUM", db.Sequelize.col("amount")), "total"],
          ],
          where: {
            createdAt: {
              [Op.between]: [
                quarter.startOf("quarter").toDate(),
                quarter.endOf("quarter").toDate(),
              ],
            },
            status: "done",
          },
        });
        data.push(result ? parseFloat(result.get("total")) || 0 : 0);
      }
    } else if (type === "year") {
      for (let i = 10; i >= 0; i--) {
        const year = moment().subtract(i, "years");
        labels.push(year.format("YYYY"));
        const result = await db.AdOrder.findOne({
          attributes: [
            [db.Sequelize.fn("SUM", db.Sequelize.col("amount")), "total"],
          ],
          where: {
            createdAt: {
              [Op.between]: [
                year.startOf("year").toDate(),
                year.endOf("year").toDate(),
              ],
            },
            status: "done",
          },
        });
        data.push(result ? parseFloat(result.get("total")) || 0 : 0);
      }
    }

    return {
      status: "OK",
      data: { labels: labels, data: data },
    };
  } catch (error) {
    return {
      status: "ERR",
      message: `Error fetching data: ${error.message}`,
    };
  }
};

const getListAdOrderByAdmin = async (filter, limit = 12) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { text, status, page = 1, type } = filter;
      // Tính toán offset cho phân trang
      const offset = (page - 1) * limit;

      // Xây dựng điều kiện lọc
      const whereConditions = {};

      if (text) {
        whereConditions[Op.or] = [
          {
            "$property.name$": {
              [Op.like]: `%${text}%`,
            },
          },
          {
            [Op.or]: [
              {
                "$user.firstName$": {
                  [Op.like]: `%${text}%`,
                },
              },
              {
                "$user.lastName$": {
                  [Op.like]: `%${text}%`,
                },
              },
              {
                [Op.and]: [
                  db.sequelize.where(
                    db.sequelize.fn(
                      "concat",
                      db.sequelize.col("user.firstName"),
                      " ",
                      db.sequelize.col("user.lastName")
                    ),
                    {
                      [Op.like]: `%${text}%`,
                    }
                  ),
                ],
              },
            ],
          },
        ];
      }

      // Thêm điều kiện lọc theo status nếu có
      if (status) {
        whereConditions.status = status;
      }

      // Thêm điều kiện lọc theo type nếu có
      const includeConditions = [
        {
          model: db.Advertising,
          as: "advertising",
          attributes: ["name", "price", "type"],
          ...(type && { where: { type: type } }), // Thêm điều kiện lọc type vào advertising
        },
        {
          model: db.Property,
          as: "property",
          attributes: ["name"],
        },
        {
          model: db.User,
          as: "user",
          attributes: ["firstName", "lastName"],
        },
      ];

      const adOrders = await db.AdOrder.findAndCountAll({
        include: includeConditions,
        where: whereConditions,
        attributes: ["amount", "methodPay", "status", "id", "createdAt"],
        limit: parseInt(limit),
        offset: offset,
        order: [["createdAt", "DESC"]],
      });

      resolve({
        status: adOrders.count > 0 ? "OK" : "ERR",
        data: adOrders.rows,
        pagination: {
          totalItems: adOrders.count, // Sửa từ adOrders.count.length thành adOrders.count
          totalPages: Math.ceil(adOrders.count / limit),
          currentPage: parseInt(page),
          pageSize: parseInt(limit),
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createAdOrder,
  updateStatusAdOrder,
  getDataBarChartAdmin,
  getListAdOrderByAdmin,
};
