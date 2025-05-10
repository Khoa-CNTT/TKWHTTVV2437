"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
<<<<<<<< HEAD:backend/src/migrations/20250430095734-add-status-to-property.js
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("Properties", "status", {
========
    await queryInterface.addColumn("Users", "status", {
>>>>>>>> main:backend/src/migrations/20250505221300-create-add-status-to-users.js
      type: Sequelize.STRING,
      defaultValue: "active", // inactive
    });
  },

  async down(queryInterface, Sequelize) {
<<<<<<<< HEAD:backend/src/migrations/20250430095734-add-status-to-property.js
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("Properties", "status");
========
    await queryInterface.removeColumn("Users", "status");
>>>>>>>> main:backend/src/migrations/20250505221300-create-add-status-to-users.js
  },
};
