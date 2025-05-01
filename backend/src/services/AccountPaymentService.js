const db = require("../models");
import { v4 } from "uuid";
const create = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.AccountPayment.create({
        id: v4(),
        ...data,
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

const infoAccountPaymment = (uid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.AccountPayment.findOne({
        where: {
          idUser: uid,
        },
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

const deleteAccountPaymment = (aid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.AccountPayment.destroy({
        where: { id: aid },
      });

      resolve({
        status: "OK",
        message: "Delete success",
      });
    } catch (error) {
      reject("error " + error);
    }
  });
};

const updateAccountPaymment = (aid, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.AccountPayment.update(
        { ...data },
        {
          where: { id: aid },
        }
      );

      resolve({
        status: "OK",
        message: "Update success",
      });
    } catch (error) {
      reject("error " + error);
    }
  });
};

module.exports = {
  create,
  infoAccountPaymment,
  deleteAccountPaymment,
  updateAccountPaymment,
};
