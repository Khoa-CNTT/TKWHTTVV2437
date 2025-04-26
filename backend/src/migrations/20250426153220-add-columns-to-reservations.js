"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Reservations", "firstName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Reservations", "lastName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Reservations", "email", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Reservations", "phone", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Reservations", "imageBanking", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Reservations", "firstName");
    await queryInterface.removeColumn("Reservations", "lastName");
    await queryInterface.removeColumn("Reservations", "email");
    await queryInterface.removeColumn("Reservations", "phone");
    await queryInterface.removeColumn("Reservations", "imageBanking");
  },
};
