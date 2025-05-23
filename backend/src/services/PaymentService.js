const moment = require("moment");
const vnpay = require("../config/vnpay.json");
const PropertyService = require("../services/PropertyService");
const db = require("../models");
const AdOrderService = require("../services/AdOderService");
const CommissionPaymentService = require("../services/CommissionPaymentService");

const createPaymentUrl = (req, res) => {
  try {
    process.env.TZ = "Asia/Ho_Chi_Minh";

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let tmnCode = vnpay.vnp_TmnCode;
    let secretKey = vnpay.vnp_HashSecret;
    let vnpUrl = vnpay.vnp_Url;
    let returnUrl = vnpay.vnp_ReturnUrl;
    let orderId = req.body.orderId;
    let amount = req.body.amount;

    let locale = req.body.language || "vn"; // Sử dụng toán tử || để gán giá trị mặc định
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;

    vnp_Params = sortObject(vnp_Params);

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    // Chỉ gửi response một lần và kết thúc hàm
    return res.status(200).json({
      success: true,
      data: { vnpUrl },
    });
  } catch (error) {
    console.error("Error in createPaymentUrl:", error);
    // Chỉ gửi response lỗi nếu chưa gửi response nào
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};

// Hàm sortObject có thể giữ nguyên
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

const vnpay_ipn = async (req, res) => {
  try {
    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];

    let orderId = vnp_Params["vnp_TxnRef"];
    let rspCode = vnp_Params["vnp_ResponseCode"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    let secretKey = vnpay.vnp_HashSecret;
    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");

    let paymentStatus = "0";
    let checkOrderId = true;
    let checkAmount = true;

    console.log({ orderId });

    if (secureHash !== signed) {
      //   return res
      //     .status(200)
      //     .json({ RspCode: "97", Message: "Checksum failed" });
      return res.redirect(
        `${process.env.URL_CLIENT}/homestay/advertising?status=false`
      );
    }

    // Kiểm tra đơn hàng
    const order = await db.AdOrder.findOne({ where: { id: orderId } });
    if (!order) {
      console.error("Order not found:", orderId);
      return res.redirect(
        `${process.env.URL_CLIENT}/homestay/advertising?status=false`
      );
    }

    // if (!checkAmount) {
    //   // return res.status(200).json({ RspCode: "04", Message: "Amount invalid" });
    //   return res.redirect(
    //     `${process.env.URL_CLIENT}/homestay/advertising?status=false`
    //   );
    // }

    if (paymentStatus !== "0") {
      return res.status(200).json({
        RspCode: "02",
        Message: "This order has been updated to the payment status",
      });
    }

    if (rspCode === "00") {
      const advertising = await db.Advertising.findOne({
        where: { id: order.idAdvertising },
      });

      if (!advertising) {
        console.error("Advertising not found for order:", orderId);
        return res.redirect(
          `${process.env.URL_CLIENT}/homestay/advertising?status=false`
        );
      }

      await PropertyService.renewalAdByUserId(
        order.idUser,
        advertising.id,
        advertising.term,
        advertising.type
      );

      await AdOrderService.updateStatusAdOrder(orderId, "done");

      return res.redirect(
        `${process.env.URL_CLIENT}/homestay/advertising?status=true`
      );
    } else {
      await AdOrderService.updateStatusAdOrder(orderId, "failed");

      return res.redirect(
        `${process.env.URL_CLIENT}/homestay/advertising?status=false`
      );
    }
  } catch (error) {
    console.error("VNPAY IPN ERROR:", error);
    return res.redirect(
      `${process.env.URL_CLIENT}/homestay/advertising?status=false`
    );
  }
};

const createPaymentUrlCommission = (req, res) => {
  try {
    process.env.TZ = "Asia/Ho_Chi_Minh";

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let tmnCode = vnpay.vnp_TmnCode;
    let secretKey = vnpay.vnp_HashSecret;
    let vnpUrl = vnpay.vnp_Url;
    let returnUrl = vnpay.vnp_ReturnUrl_commission;
    let orderId = req.body.orderId;
    let amount = req.body.amount;

    let locale = req.body.language || "vn"; // Sử dụng toán tử || để gán giá trị mặc định
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;

    vnp_Params = sortObject(vnp_Params);

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    // Chỉ gửi response một lần và kết thúc hàm
    return res.status(200).json({
      success: true,
      data: { vnpUrl },
    });
  } catch (error) {
    console.error("Error in createPaymentUrl:", error);
    // Chỉ gửi response lỗi nếu chưa gửi response nào
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};

const vnpay_ipn_comission = async (req, res) => {
  try {
    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];

    let orderId = vnp_Params["vnp_TxnRef"];
    let rspCode = vnp_Params["vnp_ResponseCode"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    let secretKey = vnpay.vnp_HashSecret;
    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");

    let paymentStatus = "0";
    let checkOrderId = true;
    let checkAmount = true;

    console.log({ orderId });

    if (secureHash !== signed) {
      return res.redirect(
        `${process.env.URL_CLIENT}/homestay/pay-commission?status=false`
      );
    }

    // Kiểm tra đơn hàng
    const order = await db.CommissionPayment.findOne({
      where: { id: orderId },
    });
    if (!order) {
      console.error("Order not found:", orderId);
      return res.redirect(
        `${process.env.URL_CLIENT}/homestay/pay-commission?status=false`
      );
    }

    if (rspCode === "00") {
      await CommissionPaymentService.updateCommissionPayment(orderId, {
        status: "done",
        paymentDate: new Date(),
        methodPay: "vnpay",
      });

      return res.redirect(
        `${process.env.URL_CLIENT}/homestay/pay-commission?status=true`
      );
    } else {
      return res.redirect(
        `${process.env.URL_CLIENT}/homestay/pay-commission?status=false`
      );
    }
  } catch (error) {
    console.error("VNPAY IPN ERROR:", error);
    return res.redirect(
      `${process.env.URL_CLIENT}/homestay/pay-commission?status=false`
    );
  }
};
module.exports = {
  createPaymentUrl,
  vnpay_ipn,
  createPaymentUrlCommission,
  vnpay_ipn_comission,
};
