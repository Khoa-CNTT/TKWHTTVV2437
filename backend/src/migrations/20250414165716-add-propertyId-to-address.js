"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Addresses", "propertyId", {
      type: Sequelize.STRING,
      allowNull: false, // Đảm bảo propertyId không null
      references: {
        model: "Properties", // Bảng `Properties` mà `propertyId` sẽ tham chiếu đến
        key: "id", // `id` của bảng `Properties`
      },
      onDelete: "CASCADE", // Khi Property bị xóa, Address liên kết cũng sẽ bị xóa
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Addresses", "propertyId");
  },
};
