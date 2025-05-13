const db = require("../models");
import { v4 } from "uuid";
import moment from "moment";
import { Op } from "sequelize";
import sendMail from "../utils/sendMail";
import convertToVietnameseDate from "../utils/convertToVietNameseDate";
import getDatesInRange from "../utils/getDatesInRange";

const lockBooking = (body) => {
  return new Promise(async (resolve, reject) => {
    let t;
    try {
      const { roomId, propertyId, userId, startDay, endDay, code } = body;
      t = await db.sequelize.transaction();
      const existingReservation = await db.Reservation.findOne({
        where: {
          idRoom: roomId,
          idProperty: propertyId,
          idUser: userId,
          checkIndate: startDay,
          checkOutdate: endDay,
          statusLock: "pending",
          locked_until: {
            [Op.gt]: new Date(), // Còn hiệu lực
          },
        },
        transaction: t,
      });

      if (existingReservation) {
        await t.rollback();
        resolve({
          status: "OK",
          msg: "Bạn đã giữ phòng này rồi, vui lòng thanh toán.",
          data: existingReservation,
        });
      }

      const dates = getDatesInRange(startDay, endDay);

      const room = await db.Room.findByPk(roomId, { transaction: t });

      if (!room) {
        await t.rollback();
        resolve({
          status: "OK",
          msg: "Không tìm thấy phòng",
        });
      }

      for (const date of dates) {
        const availability = await db.RoomAvailability.findOne({
          where: {
            idRoom: roomId,
            date: date.toISOString().slice(0, 10),
          },
          transaction: t,
        });

        if ((availability?.blocked_quantity || 0) >= room.quantity) {
          await t.rollback();
          resolve({
            status: "OK",
            msg: "Hết phòng",
          });
        }
      }

      for (const date of dates) {
        const [availability, created] = await db.RoomAvailability.findOrCreate({
          where: {
            idRoom: roomId,
            date: date.toISOString().slice(0, 10),
          },
          defaults: {
            id: v4(),
            blocked_quantity: 0,
            date: date.toISOString().slice(0, 10),
            idRoom: roomId,
            idProperty: propertyId,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        await availability.update(
          { blocked_quantity: (availability.blocked_quantity || 0) + 1 },
          { transaction: t }
        );
      }

      const booking = await db.Reservation.create(
        {
          id: v4(),
          idUser: userId,
          idRoom: roomId,
          idProperty: propertyId,
          checkIndate: startDay,
          checkOutdate: endDay,
          code: code,
          statusLock: "pending",
          locked_until: new Date(Date.now() + 15 * 60 * 1000),
        },
        {
          transaction: t,
        }
      );

      await t.commit();

      resolve({
        status: "OK",
        msg: "Đã giữ phòng, vui lòng thanh toán trong 15 phút.",
        data: booking,
      });
    } catch (error) {
      if (t && !t.finished) {
        await t.rollback();
      }
      reject("error " + error);
    }
  });
};

const removeExpiredBookings = () => {
  return new Promise(async (resolve, reject) => {
    let t;
    try {
      t = await db.sequelize.transaction();
      const expiredBookings = await db.Reservation.findAll({
        where: {
          statusLock: "pending",
          locked_until: { [Op.lt]: new Date() }, // Hết hạn
        },
        transaction: t,
      });

      for (const booking of expiredBookings) {
        const room = await db.Room.findByPk(booking.idRoom, { transaction: t });
        const dates = getDatesInRange(
          booking.checkIndate,
          booking.checkOutdate
        );

        for (const date of dates) {
          const availability = await db.RoomAvailability.findOne({
            where: {
              idRoom: booking.idRoom,
              date: date.toISOString().slice(0, 10),
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });

          if (availability && availability.blocked_quantity > 0) {
            await availability.update(
              { blocked_quantity: availability.blocked_quantity - 1 },
              { transaction: t }
            );
          }
        }

        await booking.update({ statusLock: "expired" }, { transaction: t });
      }

      await t.commit();
      resolve({
        status: "OK",
        msg: "Đã xóa hết đặt phòng hết hạn thanh toán",
      });
    } catch (error) {
      if (t && !t.finished) {
        await t.rollback();
      }
      reject("error" + error);
    }
  });
};

const createReservation = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        resId,
        email,
        phone,
        firstName,
        lastName,
        startDay,
        endDay,
        imageBanking,
        total,
        message = null,
        nameAccount,
        numberAccount,
        nameBank,
      } = body;
      console.log("data", body);

      const checkIn = convertToVietnameseDate(startDay);
      const checkOut = convertToVietnameseDate(endDay);

      const html = `
      <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Love Trip - Thanh toán đang xử lí</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 20px;
        color: #333;
      }

      .email-container {
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #ddd; /* ✅ Border bao quanh */
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      .top-bar {
        background-color: #007BFF;
        color: white;
        padding: 16px;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        letter-spacing: 1px;
      }

      .header-text {
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        margin: 20px 0 10px;
        color: #2c3e50;
      }

      .content {
        padding: 0 30px 30px;
        font-size: 15px;
        line-height: 1.6;
      }

      .details-table {
        width: 100%;
        margin-top: 15px;
        border-collapse: collapse;
      }

      .details-table td {
        padding: 8px 0;
        vertical-align: top;
      }

      .details-table td.label {
        width: 150px;
        font-weight: bold;
        color: #2c3e50;
        white-space: nowrap;
      }

      .status-success {
        color: green;
        font-weight: bold;
        white-space: nowrap;
      }

      .receipt-image {
        max-width: 100%;
        height: auto;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-top: 6px;
      }

      .footer {
        text-align: center;
        font-size: 13px;
        color: #888;
        padding: 20px 0;
        border-top: 1px solid #eee;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="top-bar">Love Trip</div>

      <div class="header-text">Thanh toán đang chờ xử lí!</div>

      <div class="content">
        <p>Xin chào <strong>${firstName} ${lastName}</strong>,</p>

        <p>Chúng tôi đã nhận được thông tin thanh toán của bạn. Phòng đặt của bạn đang được xử lý trong vòng <strong>12 giờ</strong> và chúng sẽ giới thông tin xác nhận về email của bạn.</p>

        <p><strong>Thông tin thanh toán:</strong></p>

        <table class="details-table">
          
          <tr>
            <td class="label">Chứng từ:</td>
            <td>
              <img src="${imageBanking}" alt="Chứng từ thanh toán" class="receipt-image" />
            </td>
          </tr>
        </table>

        <p>Cảm ơn bạn đã lựa chọn Love Trip.<br />Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.</p>
      </div>

      <div class="footer">
        © 2025 Love Trip. Mọi quyền được bảo lưu.
      </div>
    </div>
  </body>
</html>
`;

      const booking = await db.Reservation.findByPk(resId);
      const now = new Date();
      if (booking.statusLock !== "pending" || now > booking.locked_until) {
        resolve({
          status: "ERR",
          msg: "Đã hết thời gian thanh toán phòng.",
        });
      }

      await sendMail({
        email: email,
        text: "Cảm ơn",
        subject: "Thanh toán đang chờ xử lí",
        html: html,
      });

      // const dates = getDatesInRange(startDay, endDay);

      // for (const date of dates) {
      //   const existing = await db.RoomAvailability.findOne({
      //     where: {
      //       idRoom: roomId,
      //       date: date.toISOString().slice(0, 10),
      //     },
      //   });

      //   if (existing) {
      //     await db.RoomAvailability.update(
      //       {
      //         blocked_quantity: existing.blocked_quantity + 1,
      //       },
      //       {
      //         where: { id: existing.id },
      //       }
      //     );
      //   } else {
      //     await db.RoomAvailability.create({
      //       idRoom: roomId,
      //       date: date.toISOString().slice(0, 10),
      //       blocked_quantity: 1,
      //       idProperty: propertyId,
      //       id: v4(),
      //     });
      //   }
      // }

      const response = await db.Reservation.update(
        {
          firstName,
          lastName,
          email,
          phone,
          imageBanking,
          message,
          nameAccount,
          numberAccount,
          nameBank,
          totalPrice: total,
          statusUser: "created",
          status: "waiting",
          statusLock: "confirmed",
        },
        {
          where: { id: resId }, // Chỉ rõ bản ghi cần update
        }
      );
      const data = await db.Reservation.findByPk(resId);
      resolve({
        status: "OK",
        message: "Create success",
        data: data,
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
        where: {
          status: "waiting",
          statusLock: "confirmed",
        },
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

const approveReservation = ({
  reid,
  status,
  returnImgBanking,
  reason,
  payload,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      let html;

      if (status === "confirmed") {
        html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Xác nhận đặt phòng</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 700px;
      margin: 30px auto;
      background-color: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 1px solid #ccc;
      padding-bottom: 20px;
    }
    .header h2 {
      color: #6c1d6f;
    }
    .info-section {
      margin: 20px 0;
    }
    .highlight {
      font-weight: bold;
      color: #6c1d6f;
    }
    .box {
      background-color: #fffbea;
      border: 1px solid #f3d076;
      padding: 15px;
      margin-top: 10px;
      border-radius: 6px;
      color: #6c1d6f;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .details-table th,
    .details-table td {
      text-align: left;
      padding: 10px;
      border-bottom: 1px solid #ddd;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #777;
    }
    /* Gộp tất cả các thuộc tính cho .brand vào một chỗ */
    .brand {
      
      background-color: #3b82f6;
      color: #fff;
      padding: 16px;
      border: 1px solid #ccc;
      border-radius: 8px 8px 0 0;
      margin-bottom: 20px;
     
    }

    .brand-left {
      text-align: left;
      /* Nếu bạn muốn mỗi phần chiếm một nửa không gian, bạn có thể dùng flex: 1 */
      /* flex: 1; */
    }
    .brand-left h1 {
      font-size: 24px;
      margin: 0;
    }

    .brand-right {
      text-align: right;
      /* flex: 1; */
    }
    .brand-right p {
      font-size: 16px;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="brand">
      <div class="brand-left">
        <h1>Love Trip</h1>
      </div>
      <div class="brand-right">
        <p><strong>Mã xác nhận:</strong> <span>${payload?.code}</span></p>
      </div>
    </div>
    <div class="header">
      <h2>
        Cảm ơn ${payload?.firstName} ${
          payload?.lastName
        }! Đặt phòng của bạn tại ${
          payload?.rooms?.property?.propertyAddress?.city
        } đã được xác nhận.
      </h2>
    </div>
    <div class="info-section">
      <p>
        ✅ <strong>${
          payload?.rooms?.property?.name
        }</strong> đang chờ bạn tới nghỉ vào 
        <span class="highlight">${convertToVietnameseDate(
          payload?.checkIndate
        )}</span>
      </p>
      <p>✅ Bảo mật mã xác nhận vì mã này dùng để nhận phòng và hủy phòng</p>
      <p>
        ✅ Thanh toán của bạn đã bao gồm tất cả dịch vụ của chúng tôi. Nếu có phát sinh nó nằm ngoài dịch vụ của chúng tôi
      </p>
    </div>

    <h3 class="highlight">${payload?.rooms?.property?.name}</h3>
    <div class="box">
      Bạn đã thanh toán khi đến nghỉ tại ${payload?.rooms?.property?.name}
    </div>

    <table class="details-table">
    <tr>
        <td><strong>Mã xác nhận</strong></td>
        <td>${payload?.code}</td>
      </tr>
      <tr>
        <td><strong>Tổng thanh toán</strong></td>
        <td>${payload?.totalPrice}</td>
      </tr>
      <tr>
        <td><strong>Nhận phòng</strong></td>
        <td>${convertToVietnameseDate(
          payload?.checkIndate
        )} (14:00 - 23:00)</td>
      </tr>
      <tr>
        <td><strong>Trả phòng</strong></td>
        <td>${convertToVietnameseDate(
          payload?.checkOutdate
        )} (00:00 - 12:00)</td>
      </tr>
      <tr>
        <td><strong>Đặt phòng của bạn</strong></td>
        <td>${payload?.rooms?.name}</td>
      </tr>
      <tr>
        <td><strong>Phòng tối đa cho</strong></td>
        <td>${payload?.rooms?.maxPerson} người lớn</td>
      </tr>
      <tr>
        <td><strong>Địa điểm</strong></td>
        <td>${payload?.rooms?.property?.address}</td>
      </tr>
      <tr>
        <td><strong>Điện thoại</strong></td>
        <td>
          <a href="tel:${payload?.rooms?.property?.users?.phone}">
            ${payload?.rooms?.property?.users?.phone}
          </a>
        </td>
      </tr>
      <tr>
        <td><strong>Liên hệ email: </strong></td>
        <td>
          <a href="mailto:${payload?.rooms?.property?.users?.email}">
            ${payload?.rooms?.property?.users?.email}
          </a>
        </td>
      </tr>
    </table>

    <div class="footer">
      <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
      <p>© 2025 Love Trip. Mọi quyền được bảo lưu.</p>
    </div>
  </div>
</body>
</html>
      `;
      } else if (
        (status === "reject" && returnImgBanking) ||
        (status === "refund" && returnImgBanking)
      ) {
        html = `
         <!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Xác nhận đặt phòng</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 700px;
      margin: 30px auto;
      background-color: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 1px solid #ccc;
      padding-bottom: 20px;
    }
    .header h2 {
      color: #6c1d6f;
    }
    .info-section {
      margin: 20px 0;
    }
    .highlight {
      font-weight: bold;
      color: #6c1d6f;
    }
    .box {
      background-color: #fffbea;
      border: 1px solid #f3d076;
      padding: 15px;
      margin-top: 10px;
      border-radius: 6px;
      color: #6c1d6f;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .details-table th,
    .details-table td {
      text-align: left;
      padding: 10px;
      border-bottom: 1px solid #ddd;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #777;
    }
    /* Gộp tất cả các thuộc tính cho .brand vào một chỗ */
    .brand {
      
      background-color: #3b82f6;
      color: #fff;
      padding: 16px;
      border: 1px solid #ccc;
      border-radius: 8px 8px 0 0;
      margin-bottom: 20px;
     
    }

    .brand-left {
      text-align: left;
      /* Nếu bạn muốn mỗi phần chiếm một nửa không gian, bạn có thể dùng flex: 1 */
      /* flex: 1; */
    }
    .brand-left h1 {
      font-size: 24px;
      margin: 0;
    }

    .brand-right {
      text-align: right;
      /* flex: 1; */
    }
    .brand-right p {
      font-size: 16px;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="brand">
      <div class="brand-left">
        <h1>Love Trip</h1>
      </div>
      <div class="brand-right">
        <p><strong>Mã xác nhận:</strong> <span>${payload?.code}</span></p>
      </div>
    </div>
    <div class="header">
    <div class="box" style="background-color: #ffe5e5; border: 1px solid #ff9999; color: #b30000;">
  ❌ Yêu cầu đặt phòng của bạn đã bị từ chối.
  <br />
  🔎 <strong>Lý do:</strong> ${reason}
</div>

<div style="margin-top: 20px;">
  <strong>Chứng từ hoàn tiền:</strong><br />
  <img 
    src=${returnImgBanking}
    alt="Chứng từ hoàn tiền" 
    style="margin-top: 10px; width: 30%; border: 1px solid #ccc; border-radius: 6px;" 
  />
</div>
      
    </div>
    <div class="info-section">
      <p>
        ✅ <strong>${
          payload?.rooms?.property?.name
        }</strong> đang chờ bạn tới nghỉ vào 
        <span class="highlight">${convertToVietnameseDate(
          payload?.checkIndate
        )}</span>
      </p>
      <p>✅ Bảo mật mã xác nhận vì mã này dùng để nhận phòng và hủy phòng</p>
      <p>
        ✅ Thanh toán của bạn đã bao gồm tất cả dịch vụ của chúng tôi. Nếu có phát sinh nó nằm ngoài dịch vụ của chúng tôi
      </p>
    </div>

    <h3 class="highlight">${payload?.rooms?.property?.name}</h3>
    <div class="box">
      Bạn đã thanh toán khi đến nghỉ tại ${payload?.rooms?.property?.name}
    </div>

    <table class="details-table">
    <tr>
        <td><strong>Mã xác nhận</strong></td>
        <td>${payload?.code}</td>
      </tr>
      <tr>
        <td><strong>Tổng thanh toán</strong></td>
        <td>${payload?.totalPrice}</td>
      </tr>
      <tr>
        <td><strong>Nhận phòng</strong></td>
        <td>${convertToVietnameseDate(
          payload?.checkIndate
        )} (14:00 - 23:00)</td>
      </tr>
      <tr>
        <td><strong>Trả phòng</strong></td>
        <td>${convertToVietnameseDate(
          payload?.checkOutdate
        )} (00:00 - 12:00)</td>
      </tr>
      <tr>
        <td><strong>Đặt phòng của bạn</strong></td>
        <td>${payload?.rooms?.name}</td>
      </tr>
      <tr>
        <td><strong>Phòng tối đa cho</strong></td>
        <td>${payload?.rooms?.maxPerson} người lớn</td>
      </tr>
      <tr>
        <td><strong>Địa điểm</strong></td>
        <td>${payload?.rooms?.property?.address}</td>
      </tr>
      <tr>
        <td><strong>Điện thoại</strong></td>
        <td>
          <a href="tel:${payload?.rooms?.property?.users?.phone}">
            ${payload?.rooms?.property?.users?.phone}
          </a>
        </td>
      </tr>
      <tr>
        <td><strong>Liên hệ email: </strong></td>
        <td>
          <a href="mailto:${payload?.rooms?.property?.users?.email}">
            ${payload?.rooms?.property?.users?.email}
          </a>
        </td>
      </tr>
    </table>

    <div class="footer">
      <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
      <p>© 2025 Love Trip. Mọi quyền được bảo lưu.</p>
    </div>
  </div>
</body>
</html>
        `;
      } else if (
        (status === "reject" && returnImgBanking === null) ||
        (status === "refund" && returnImgBanking === null)
      ) {
        html = `
        <!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Xác nhận đặt phòng</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 700px;
      margin: 30px auto;
      background-color: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 1px solid #ccc;
      padding-bottom: 20px;
    }
    .header h2 {
      color: #6c1d6f;
    }
    .info-section {
      margin: 20px 0;
    }
    .highlight {
      font-weight: bold;
      color: #6c1d6f;
    }
    .box {
      background-color: #fffbea;
      border: 1px solid #f3d076;
      padding: 15px;
      margin-top: 10px;
      border-radius: 6px;
      color: #6c1d6f;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .details-table th,
    .details-table td {
      text-align: left;
      padding: 10px;
      border-bottom: 1px solid #ddd;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #777;
    }
    /* Gộp tất cả các thuộc tính cho .brand vào một chỗ */
    .brand {
      
      background-color: #3b82f6;
      color: #fff;
      padding: 16px;
      border: 1px solid #ccc;
      border-radius: 8px 8px 0 0;
      margin-bottom: 20px;
     
    }

    .brand-left {
      text-align: left;
      /* Nếu bạn muốn mỗi phần chiếm một nửa không gian, bạn có thể dùng flex: 1 */
      /* flex: 1; */
    }
    .brand-left h1 {
      font-size: 24px;
      margin: 0;
    }

    .brand-right {
      text-align: right;
      /* flex: 1; */
    }
    .brand-right p {
      font-size: 16px;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="brand">
      <div class="brand-left">
        <h1>Love Trip</h1>
      </div>
      <div class="brand-right">
        <p><strong>Mã xác nhận:</strong> <span>${payload?.code}</span></p>
      </div>
    </div>
    <div class="header">
    <div class="box" style="background-color: #ffe5e5; border: 1px solid #ff9999; color: #b30000;">
  ❌ Yêu cầu đặt phòng của bạn đã bị từ chối.
  <br />
  🔎 <strong>Lý do:</strong> ${reason}
</div>


      
    </div>
    <div class="info-section">
      <p>
        ✅ <strong>${
          payload?.rooms?.property?.name
        }</strong> đang chờ bạn tới nghỉ vào 
        <span class="highlight">${convertToVietnameseDate(
          payload?.checkIndate
        )}</span>
      </p>
      <p>✅ Bảo mật mã xác nhận vì mã này dùng để nhận phòng và hủy phòng</p>
      <p>
        ✅ Thanh toán của bạn đã bao gồm tất cả dịch vụ của chúng tôi. Nếu có phát sinh nó nằm ngoài dịch vụ của chúng tôi
      </p>
    </div>

    <h3 class="highlight">${payload?.rooms?.property?.name}</h3>
    <div class="box">
      Bạn đã thanh toán khi đến nghỉ tại ${payload?.rooms?.property?.name}
    </div>

    <table class="details-table">
    <tr>
        <td><strong>Mã xác nhận</strong></td>
        <td>${payload?.code}</td>
      </tr>
      <tr>
        <td><strong>Tổng thanh toán</strong></td>
        <td>${payload?.totalPrice}</td>
      </tr>
      <tr>
        <td><strong>Nhận phòng</strong></td>
        <td>${convertToVietnameseDate(
          payload?.checkIndate
        )} (14:00 - 23:00)</td>
      </tr>
      <tr>
        <td><strong>Trả phòng</strong></td>
        <td>${convertToVietnameseDate(
          payload?.checkOutdate
        )} (00:00 - 12:00)</td>
      </tr>
      <tr>
        <td><strong>Đặt phòng của bạn</strong></td>
        <td>${payload?.rooms?.name}</td>
      </tr>
      <tr>
        <td><strong>Phòng tối đa cho</strong></td>
        <td>${payload?.rooms?.maxPerson} người lớn</td>
      </tr>
      <tr>
        <td><strong>Địa điểm</strong></td>
        <td>${payload?.rooms?.property?.address}</td>
      </tr>
      <tr>
        <td><strong>Điện thoại</strong></td>
        <td>
          <a href="tel:${payload?.rooms?.property?.users?.phone}">
            ${payload?.rooms?.property?.users?.phone}
          </a>
        </td>
      </tr>
      <tr>
        <td><strong>Liên hệ email: </strong></td>
        <td>
          <a href="mailto:${payload?.rooms?.property?.users?.email}">
            ${payload?.rooms?.property?.users?.email}
          </a>
        </td>
      </tr>
    </table>

    <div class="footer">
      <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
      <p>© 2025 Love Trip. Mọi quyền được bảo lưu.</p>
    </div>
  </div>
</body>
</html>
        `;
      }

      await sendMail({
        email: payload?.email,
        text: "Cảm ơn",
        subject: "Xác nhận thanh toán",
        html: html,
      });

      if (status === "reject") {
        const dates = getDatesInRange(
          payload.checkIndate,
          payload.checkOutdate
        );

        for (const date of dates) {
          const existing = await db.RoomAvailability.findOne({
            where: {
              idRoom: payload.idRoom,
              date: date.toISOString().slice(0, 10),
            },
          });

          if (existing) {
            await db.RoomAvailability.update(
              {
                blocked_quantity: existing.blocked_quantity - 1,
              },
              {
                where: { id: existing.id },
              }
            );
          }
        }
      }

      const response = await db.Reservation.update(
        {
          status: status,
          returnImgBanking: returnImgBanking,
          reason: reason,
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
        where: {
          idUser: idUser,
          statusLock: "confirmed",
        },
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
            attributes: ["name", "price", "maxPerson"],
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
                  {
                    model: db.User,
                    as: "users", // alias này cần đúng với định nghĩa trong model
                    attributes: ["email", "phone"],
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

const getTimeOfResLockbyId = (idRes) => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = [["createdAt", "DESC"]];

      const response = await db.Reservation.findOne({
        where: { id: idRes },
        attributes: ["statusLock", "locked_until"],
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

const updateStatusUserReservation = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { startDay, endDay, idRoom, id, statusUser } = data;

      if (statusUser === "canceled") {
        const dates = getDatesInRange(startDay, endDay);

        for (const date of dates) {
          const existing = await db.RoomAvailability.findOne({
            where: {
              idRoom: idRoom,
              date: date.toISOString().slice(0, 10),
            },
          });

          if (existing) {
            await db.RoomAvailability.update(
              {
                blocked_quantity: existing.blocked_quantity - 1,
              },
              {
                where: { id: existing.id },
              }
            );
          }
        }
      }

      if (statusUser === "created") {
        const dates = getDatesInRange(startDay, endDay);

        for (const date of dates) {
          const existing = await db.RoomAvailability.findOne({
            where: {
              idRoom: idRoom,
              date: date.toISOString().slice(0, 10),
            },
          });

          if (existing) {
            await db.RoomAvailability.update(
              {
                blocked_quantity: existing.blocked_quantity + 1,
              },
              {
                where: { id: existing.id },
              }
            );
          }
        }
      }
      const response = await db.Reservation.update(
        {
          statusUser: statusUser,
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
              status: "confirmed",
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
              status: "confirmed",
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
              status: "confirmed",
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
  lockBooking,
  removeExpiredBookings,
  createReservation,
  listReservationApprove,
  detailReservationApprove,
  approveReservation,
  listReservationOfUser,
  detailReservationOfUser,
  updateInfoReservation,
  getDataBarChart,
  updateStatusUserReservation,
  getTimeOfResLockbyId,
};
