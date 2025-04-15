// models/Property.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    static associate(models) {
      // define association here
      Property.hasMany(models.Room, {
        foreignKey: "idProperty",
        as: "rooms",
      });

      // Quan hệ 1-1 với Address
      Property.hasOne(models.Address, {
        foreignKey: "propertyId", // Khóa ngoại trong bảng Address
        as: "address",
      });

      Property.belongsTo(models.User, {
        foreignKey: "idUser", // Khóa ngoại trong bảng Property
        as: "owner", // Alias để truy cập thông tin chủ sở hữu từ Property
      });
    }
  }
  Property.init(
    {
      idUser: DataTypes.STRING,
      idCategory: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Property",
    }
  );
  return Property;
};
