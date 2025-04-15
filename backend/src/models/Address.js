// models/Address.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {
      // Quan hệ 1-1 với Property
      Address.belongsTo(models.Property, {
        foreignKey: "propertyId", // Khóa ngoại này phải có trong bảng Address
        as: "property",
      });

      Address.belongsToMany(models.Vibe, {
        through: models.AddressVibe,
        foreignKey: "addressId",
        otherKey: "vibeId",
        as: "vibes",
      });
    }
  }
  Address.init(
    {
      street: DataTypes.STRING,
      district: DataTypes.STRING,
      city: DataTypes.STRING,
      ward: DataTypes.STRING,
      country: DataTypes.STRING,
      propertyId: DataTypes.STRING, // Khóa ngoại liên kết với Property
    },
    {
      sequelize,
      modelName: "Address",
    }
  );
  return Address;
};
