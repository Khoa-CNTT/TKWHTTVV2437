"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("HighLightProperties", {
      idHightlight: {
        type: Sequelize.STRING,
      },
      idProperty: {
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
    await queryInterface.addConstraint("HighLightProperties", {
      fields: ["idHightlight", "idProperty"], // Columns that form the composite key
      type: "primary key",
      name: "HighLightProperties_pkey", // Name of the primary key constraint
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("HighlightProperties");
  },
};
