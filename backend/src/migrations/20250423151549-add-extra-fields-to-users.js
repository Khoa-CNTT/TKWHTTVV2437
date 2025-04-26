"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "bio", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Users", "gender", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Users", "dateOfBirth", {
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn("Users", "emergencyPhone", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Users", "address", {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "bio");
    await queryInterface.removeColumn("Users", "gender");
    await queryInterface.removeColumn("Users", "dateOfBirth");
    await queryInterface.removeColumn("Users", "emergencyPhone");
    await queryInterface.removeColumn("Users", "address");
  },
};
