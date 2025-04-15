"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid"); // Import uuid v4

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // define association here
    }
  }

  Category.init(
    {
      id: {
        type: DataTypes.STRING, // Chọn kiểu STRING để lưu UUID
        primaryKey: true,
        defaultValue: uuidv4, // Tự động sinh ID khi tạo bản ghi
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Category",
    }
  );
  return Category;
};
