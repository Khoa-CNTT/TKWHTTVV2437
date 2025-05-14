"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Reservations", "statusLock", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn("Reservations", "locked_until", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Reservations", "statusLock");
    await queryInterface.removeColumn("Reservations", "locked_until");
  },
};
