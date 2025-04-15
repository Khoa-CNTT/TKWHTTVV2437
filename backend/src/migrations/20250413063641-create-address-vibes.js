"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Tạo bảng AddressVibes
    await queryInterface.createTable("AddressVibes", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      addressId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Addresses", // Tên bảng Addresses
          key: "id", // Khóa chính của bảng Addresses
        },
        onDelete: "CASCADE",
      },
      vibeId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Vibes", // Tên bảng Vibes
          key: "id", // Khóa chính của bảng Vibes
        },
        onDelete: "CASCADE",
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
    // Xóa bảng AddressVibes
    await queryInterface.dropTable("AddressVibes");
  },
};
