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
      if (payload?.status === "confirmed") {
        const registerParner = await db.RegisterPartner.findOne({
          where: { id: id },
        });

        const upadteRoleUser = await db.User.update(
          {
            role: "7",
          },
          {
            where: { id: registerParner?.idUser },
          }
        );
      }

      if (payload?.status === "rejected") {
        const registerParner = await db.RegisterPartner.findOne({
          where: { id: id },
        });

        const upadteRoleUser = await db.User.update(
          {
            role: "3",
          },
          {
            where: { id: registerParner?.idUser },
          }
        );
      }

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

const getAllRegisterPartner = (status, filter, page, limit = 10) => {
  return new Promise(async (resolve, reject) => {
    console.log(filter, status);
    let queries = {};
    let order;
    if (filter === "oldest") {
      order = [["createdAt", "ASC"]];
    } else {
      order = [["createdAt", "DESC"]];
    }
    if (status && status !== "default") queries.status = status;
    let offset = !page || +page <= 1 ? 0 : +page - 1;

    try {
      const response = await db.RegisterPartner.findAndCountAll({
        where: queries,
        offset: offset * limit,
        limit: limit,
        include: [
          {
            model: db.User,
            as: "user", // alias đúng với association
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        order,
      });

      resolve({
        status: response ? "OK" : "ERR",
        limit: limit,
        page: offset + 1,
        data: response,
      });
    } catch (error) {
      reject("error :" + error);
    }
  });
};

module.exports = {
  registerPartner,
  detailRegisterPartner,
  updateRegisterPartner,
  cancelRegisterPartner,
  getAllRegisterPartner,
};
