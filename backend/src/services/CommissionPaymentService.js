const db = require("../models");
const Op = require("sequelize").Op;
const moment = require("moment");

const getListCommissionPaymentByPropertyId = (propertyId) => {
  return new Promise(async (resolve, reject) => {
    console.log({ propertyId });
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed in JS, so +1
      const currentYear = currentDate.getFullYear();

      const commissionPayment = await db.CommissionPayment.findAll({
        where: {
          idProperty: propertyId,
          status: "pending",
          [db.Sequelize.Op.and]: [
            // Trường hợp năm nhỏ hơn năm hiện tại (tháng nào cũng được)
            {
              year: { [db.Sequelize.Op.lte]: currentYear },
            },
            // Hoặc cùng năm nhưng tháng nhỏ hơn tháng hiện tại
            {
              year: currentYear,
              month: { [db.Sequelize.Op.lt]: currentMonth },
            },
          ],
        },
        order: [
          ["year", "ASC"], // Sắp xếp năm tăng dần (cũ → mới)
          ["month", "ASC"], // Nếu cùng năm, sắp xếp tháng tăng dần
        ],
      });

      resolve({
        status: commissionPayment.length > 0 ? "OK" : "ERR",
        data: commissionPayment || [],
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateCommissionPayment = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const commissionPayment = await db.CommissionPayment.findByPk(id);
      if (commissionPayment) {
        await commissionPayment.update(data);
        resolve({
          status: "OK",
          data: commissionPayment,
        });
      } else {
        resolve({
          status: "ERR",
          message: "Commission payment not found",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getDataBarChartCommissionAdmin = async (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { type } = filter;
      const labels = [];
      const data = [];

      if (type === "month") {
        for (let i = 11; i >= 0; i--) {
          const month = moment().subtract(i, "months");
          labels.push(month.format("MM/YYYY"));
          const result = await db.CommissionPayment.findOne({
            attributes: [
              [
                db.Sequelize.fn("SUM", db.Sequelize.col("commissionAmount")),
                "total",
              ],
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
          const result = await db.CommissionPayment.findOne({
            attributes: [
              [
                db.Sequelize.fn("SUM", db.Sequelize.col("commissionAmount")),
                "total",
              ],
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
          const result = await db.CommissionPayment.findOne({
            attributes: [
              [
                db.Sequelize.fn("SUM", db.Sequelize.col("commissionAmount")),
                "total",
              ],
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

      resolve({
        status: "OK",
        data: { labels, data },
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getListCommissionPaymentByAdmin = (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { page = 1, limit = 12, text, status, month, year } = filter;
      const offset = (page - 1) * limit;
      const where = {};

      if (status) {
        where.status = status;
      }

      if (month) {
        where.month = month;
      }

      if (year) {
        where.year = year;
      }

      if (text) {
        where[Op.or] = [
          {
            "$property.name$": {
              [Op.like]: `%${text}%`,
            },
          },
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
        ];
      }

      const commissionPayment = await db.CommissionPayment.findAndCountAll({
        where,
        include: [
          {
            model: db.Property,
            as: "property",
            attributes: ["id", "name"],
          },
          {
            model: db.User,
            as: "user",
            attributes: ["id", "firstName", "lastName"],
          },
        ],
        order: [["createdAt", "DESC"]],
        offset,
        limit,
      });

      resolve({
        status: commissionPayment.rows.length > 0 ? true : false,
        data: commissionPayment.rows,
        pagination: {
          totalItems: commissionPayment.count,
          totalPages: Math.ceil(commissionPayment.count / limit),
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
  getListCommissionPaymentByPropertyId,
  updateCommissionPayment,
  getDataBarChartCommissionAdmin,
  getListCommissionPaymentByAdmin,
};
