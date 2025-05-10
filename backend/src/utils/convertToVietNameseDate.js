const moment = require("moment");

const convertToVietnameseDate = (date) => {
  return moment(date).locale("vi").format("dddd, DD/MM/YYYY");
};

module.exports = convertToVietnameseDate;
