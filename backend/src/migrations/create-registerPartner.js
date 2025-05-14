"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("RegisterPartners", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      numberCCCD: {
        type: Sequelize.STRING,
      },
      beforeImage: {
        type: Sequelize.STRING,
      },
      afterImage: {
        type: Sequelize.STRING,
      },
      status: {
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
    await queryInterface.dropTable("RegisterPartners");
  },
};
