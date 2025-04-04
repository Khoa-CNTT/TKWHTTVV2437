"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Rooms", "address", {
      type: Sequelize.STRING, // Kiểu dữ liệu là STRING
      allowNull: true, // Cho phép null
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Rooms", "address");
  },
};
