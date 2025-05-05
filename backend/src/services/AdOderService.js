const { status } = require("../controllers/AIController");
const db = require("../models");
const { v4 } = require("uuid");

const createAdOrder = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { amount, idAdvertising, idUser, methodPay, quantity } = data;
      console.log({ data });
      const adOrder = await db.AdOrder.create({
        id: v4(),
        amount: amount,
        idAdvertising: idAdvertising,
        idUser: idUser,
        methodPay: methodPay,
        quantity: quantity,
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

module.exports = {
  createAdOrder,
  updateStatusAdOrder,
};
