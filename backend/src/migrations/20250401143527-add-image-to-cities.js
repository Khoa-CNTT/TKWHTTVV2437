"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Cities", "image", {
      type: Sequelize.STRING,
      allowNull: true, // Cho phép null nếu không bắt buộc
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Cities", "image");
  },
};
