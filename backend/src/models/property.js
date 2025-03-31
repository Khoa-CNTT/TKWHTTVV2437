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

      Property.belongsTo(models.City, {
        foreignKey: "idCity", // Khóa ngoại trong bảng imageRoom
        as: "city", // Alias để truy cập
      });
    }
  }
  Property.init(
    {
      idUser: DataTypes.STRING,
      idCategory: DataTypes.STRING,
      idCity: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Property",
    }
  );
  return Property;
};
