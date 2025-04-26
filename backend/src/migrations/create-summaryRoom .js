"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SummaryRooms", {
      idRoom: {
        type: Sequelize.STRING,
      },
      idSummary: {
        type: Sequelize.STRING,
      },
      status: {
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

     // Add composite primary key
     await queryInterface.addConstraint("SummaryRooms", {
      fields: ["idRoom", "idSummary"], // Columns that form the composite key
      type: "primary key",
      name: "SummaryRooms_pkey", // Name of the primary key constraint
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("SummaryRooms");
  },
};
