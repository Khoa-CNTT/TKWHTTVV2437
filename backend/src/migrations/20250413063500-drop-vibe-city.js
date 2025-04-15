"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Xóa bảng VibeCity
    await queryInterface.dropTable("VibeCities");
  },

  async down(queryInterface, Sequelize) {
    // Tạo lại bảng VibeCity (nếu cần hoàn tác)
    await queryInterface.createTable("VibeCities", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      idVibe: {
        type: Sequelize.STRING,
      },
      idRoom: {
        type: Sequelize.STRING,
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
};