"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Reservations", "message", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn("Reservations", "nameAccount", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn("Reservations", "numberAccount", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn("Reservations", "nameBank", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn("Reservations", "statusUser", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn("Reservations", "returnImgBanking", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn("Reservations", "code", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Reservations", "message");
    await queryInterface.removeColumn("Reservations", "nameAccount");
    await queryInterface.removeColumn("Reservations", "numberAccount");
    await queryInterface.removeColumn("Reservations", "nameBank");
    await queryInterface.removeColumn("Reservations", "statusUser");
    await queryInterface.removeColumn("Reservations", "returnImgBanking");
    await queryInterface.removeColumn("Reservations", "code");
  },
};
