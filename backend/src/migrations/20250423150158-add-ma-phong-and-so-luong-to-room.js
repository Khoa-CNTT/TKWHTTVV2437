"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("Rooms", "code", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("Rooms", "quantity", {
      type: Sequelize.INTEGER,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("Rooms", "code");
    await queryInterface.removeColumn("Rooms", "quantity");
  },
};
