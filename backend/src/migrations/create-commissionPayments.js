"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CommissionPayments", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      idUser: {
        type: Sequelize.STRING,
      },
      idProperty: {
        type: Sequelize.STRING,
      },
      month: {
        // thanh toan cho thang
        type: Sequelize.INTEGER,
      },
      year: {
        // thanh toan cho thang - nam
        type: Sequelize.INTEGER,
      },
      totalRevenue: {
        // tong doanh thu cua homestay
        type: Sequelize.DOUBLE,
      },
      commissionAmount: {
        // tien hoa hong phai tra
        type: Sequelize.DOUBLE,
      },
      commissionRate: {
        // ty le hoa hong
        type: Sequelize.DOUBLE,
      },
      status: {
        // trang thai payment
        type: Sequelize.STRING, // pending, done
        defaultValue: "pending",
      },
      paymentDate: {
        // ngay payment thuc te
        type: Sequelize.DATE,
      },
      methodPay: {
        type: Sequelize.STRING,
      },
      orderQuantity: {
        // số lượng order booking
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("CommissionPayments");
  },
};
