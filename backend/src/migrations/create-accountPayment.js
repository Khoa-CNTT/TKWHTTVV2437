"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AccountPayments", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      numberAccount: {
        type: Sequelize.STRING,
      },
      nameAccount: {
        type: Sequelize.STRING,
      },
      nameBank: {
        type: Sequelize.STRING,
      },
      qrCode: {
        type: Sequelize.STRING,
      },
      idUser: {
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("AccountPayments");
  },
};
