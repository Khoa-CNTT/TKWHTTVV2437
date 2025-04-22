"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AmenityProperties", {
      idProperty: {
        type: Sequelize.STRING,
      },
      idAmenity: {
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
    await queryInterface.addConstraint("AmenityProperties", {
      fields: ["idProperty", "idAmenity"], // Columns that form the composite key
      type: "primary key",
      name: "AmenityProperties_pkey", // Name of the primary key constraint
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("AmenityProperties");
  },
};
