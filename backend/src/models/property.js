"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Property.hasMany(models.Room, {
        foreignKey: "idProperty", // Khóa ngoại trong bảng imageRoom
        as: "rooms", // Alias để truy cập
      });
      Property.belongsTo(models.Category, {
        foreignKey: "idCategory", // Khóa ngoại trỏ đến Category
        as: "category",
      });
      Property.hasMany(models.ImageProperty, {
        foreignKey: "idProperty", // Khóa ngoại trong bảng imageRoom
        as: "images", // Alias để truy cập
      });

      Property.hasMany(models.Review, {
        foreignKey: "idProperty", // Khóa ngoại trong bảng imageRoom
        as: "reviews", // Alias để truy cập
      });

      Property.belongsTo(models.Address, {
        foreignKey: "idAddress", // Khóa ngoại trong bảng Property
        as: "address", // Alias để truy cập
      });

    
    }
  }
  Property.init(
    {
      idUser: DataTypes.STRING,
      idCategory: DataTypes.STRING,
      idAddress: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Property",
    }
  );
  return Property;
};
