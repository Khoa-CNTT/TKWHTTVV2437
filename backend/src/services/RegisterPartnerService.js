const db = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
import moment from "moment";
import { v4 } from "uuid";

require("dotenv").config();

const registerPartner = (data) => {
  return new Promise(async (resolve, reject) => {
    const { idUser, name, numberCCCD, beforeImage, afterImage } = data;
    try {
      const [response, created] = await db.RegisterPartner.findOrCreate({
        where: { idUser },
        defaults: {
          id: v4(),
          name,
          numberCCCD,
          beforeImage,
          afterImage,
          status: "request",
        },
      });
      resolve({
        status: created ? "OK" : "ERR",
        msg: created
          ? "Gởi yêu cầu thành công"
          : "Yêu cầu của bạn đang được chờ xác nhận",
        data: response || null,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const detailRegisterPartner = (idUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const partner = await db.RegisterPartner.findOne({
        where: { idUser: idUser },
      });

      resolve({
        status: partner?.dataValues ? "OK" : "ERR",
        data: partner?.dataValues || null,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateRegisterPartner = (id, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const respone = await db.RegisterPartner.update(
        { ...payload },
        {
          where: { id: id },
        }
      );

      resolve({
        status: respone[0] > 0 ? "OK" : "ERR",
        msg: respone[0] > 0 ? "Đã cập nhật" : "Cập nhật thất bại",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const cancelRegisterPartner = (idUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletedCount = await db.RegisterPartner.destroy({
        where: {
          idUser: idUser,
        },
      });

      resolve({
        status: deletedCount === 0 ? "ERR" : "OK",
        msg: deletedCount === 0 ? "Không có tài khoản đăng kí" : "Đã hủy ",
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  registerPartner,
  detailRegisterPartner,
  updateRegisterPartner,
  cancelRegisterPartner,
};
