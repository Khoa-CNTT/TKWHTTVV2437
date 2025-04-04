const db = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
import { v4 } from "uuid";
const generateOTP = require("../utils/generateOTP");
const sendMail = require("../utils/sendMail");
require("dotenv").config();
const { generalAccessToken, generalRefreshToken } = require("./JwtService");
let otpStore = {};

const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(12));

const registerUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { phone, password, email, firstName, lastName } = newUser;
    try {
      const response = await db.User.findOrCreate({
        where: { [Op.or]: [{ phone }, { email }] },
        defaults: {
          email,
          phone,
          firstName,
          lastName,
          password: hashPassword(password),
          role: "3",
          id: v4(),
        },
      });

      if (response[1]) {
        const checkUser = await db.User.findOne({
          where: { email },
          raw: true,
        });
        const access_token = await generalAccessToken({
          id: checkUser.id,
          role: checkUser.role,
        });
        const refresh_token = await generalRefreshToken({
          id: checkUser.id,
          role: checkUser.role,
        });

        resolve({
          status: "OK",
          msg: "Register is success",
          access_token,
          refresh_token,
        });
      }

      resolve({
        status: response[1] ? "OK" : "ERR",
        msg: response[1] ? "Register is success" : "Phone is exist",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const signInUser = (user) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = user;
    try {
      const checkUser = await db.User.findOne({
        where: { email },
        raw: true,
      });

      if (checkUser === null) {
        resolve({ status: "ERR", msg: "The user is not defined" });
      }

      const isCorrectPassword = bcrypt.compareSync(
        password,
        checkUser.password
      );

      if (!isCorrectPassword) {
        resolve({
          status: "ERR",
          msg: "The password or user is incorrect",
        });
      }

      const access_token = await generalAccessToken({
        id: checkUser.id,
        role: checkUser.role,
      });
      const refresh_token = await generalRefreshToken({
        id: checkUser.id,
        role: checkUser.role,
      });
      resolve({
        status: "OK",
        msg: "SUCCESS",
        access_token,
        refresh_token,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const detailUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: { id: id },
      });

      resolve({
        status: user?.dataValues ? "OK" : "ERR",
        data: user?.dataValues || null,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateUser = (id, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const respone = await db.User.update(
        { ...payload },
        {
          where: { id: id },
        }
      );

      resolve({
        status: respone[0] > 0 ? "OK" : "ERR",
        msg: respone[0] > 0 ? "Update" : "Failer to update user",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const sendMailOTP = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const OTP = generateOTP();
      if (otpStore[email] && otpStore[email].expires > Date.now()) {
        delete otpStore[email];
      }

      const expires = Date.now() + 5 * 60 * 1000;
      otpStore[email] = { OTP, expires };
      console.log("oooopp");
      console.log(otpStore);
      const html = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Email Notification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        background: #007bff;
        color: white;
        text-align: center;
        padding: 10px 0;
        font-size: 20px;
        border-radius: 8px 8px 0 0;
      }
      .content {
        padding: 20px;
        font-size: 16px;
        color: #333;
      }
      .button {
        display: flex;
        font-weight: 600;
        margin: 10px 15px;
        justify-content: center;
        font-size: 20px;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #777;
        padding: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">📩 Thông báo quan trọng</div>
      <div class="content">
        <p>Xin chào,</p>
        <p>Mã bảo mật của bạn sẽ hết hạn sau 15 phút:</p>
        <p style="text-align: center;">
          <p class="button">${OTP}</p>
        </p>
        <p>Không chia sẻ mã này hoặc chuyển tiếp email này cho bất kỳ ai khác. Nếu bạn không thực hiện yêu cầu này, bạn có thể bỏ qua email này.</p>
        
        <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
      </div>
      <div class="footer">© 2025 Mọi quyền được bảo lưu.</div>
    </div>
  </body>
  </html>`;

      await sendMail({
        email: email,
        text: OTP,
        subject: "VERIFY OTP",
        html: html,
      });

      const checkUser = await db.User.findOne({
        where: { email },
        raw: true,
      });

      if (checkUser === null) {
        resolve({
          status: "OK",
          msg: "Account is not exist",
          isExist: false,
        });
      }
      resolve({
        status: "OK",
        msg: "Account is exist",
        isExist: true,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const verifyOTP = (email, OTP) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("oooopp");
      console.log(otpStore);
      if (
        otpStore[email] &&
        otpStore[email].OTP === OTP &&
        otpStore[email].expires > Date.now()
      ) {
        delete otpStore[email];

        resolve({
          status: "OK",
          msg: "OTP verified successfully",
        });
      }
      resolve({
        status: "OK",
        msg: "OTP expired or invalid",
      });
    } catch (error) {
      reject(err);
    }
  });
};

const verifyOTPLogin = (email, OTP) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        otpStore[email] &&
        otpStore[email].OTP === OTP &&
        otpStore[email].expires > Date.now()
      ) {
        delete otpStore[email];
        const checkUser = await db.User.findOne({
          where: { email },
          raw: true,
        });

        const access_token = await generalAccessToken({
          id: checkUser.id,
          role: checkUser.role,
        });
        const refresh_token = await generalRefreshToken({
          id: checkUser.id,
          role: checkUser.role,
        });
        resolve({
          status: "OK",
          msg: "OTP verified successfully",
          access_token: access_token,
          refresh_token: refresh_token,
        });
      }
      resolve({
        status: "OK",
        msg: "OTP expired or invalid",
      });
    } catch (error) {
      reject(err);
    }
  });
};
module.exports = {
  registerUser,
  signInUser,
  detailUser,
  updateUser,
  sendMailOTP,
  verifyOTP,
  verifyOTPLogin,
};
