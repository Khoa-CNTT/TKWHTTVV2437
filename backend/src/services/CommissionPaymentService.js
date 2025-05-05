const db = require("../models");

const getListCommissionPaymentByPropertyId = (propertyId) => {
  return new Promise(async (resolve, reject) => {
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

module.exports = {
  getListCommissionPaymentByPropertyId,
  updateCommissionPayment,
};
