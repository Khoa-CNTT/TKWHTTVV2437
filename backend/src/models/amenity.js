"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Amenity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Amenity.belongsToMany(models.Room, {
        through: "AmenityRoom", // Tên bảng trung gian
        foreignKey: "idAmenity", // Khóa ngoại trong bảng trung gian trỏ đến Amenity
        otherKey: "idRoom", // Khóa ngoại trong bảng trung gian trỏ đến Room
        as: "rooms", // Alias để truy cập
      });
    }
  }
  Amenity.init(
    {
      name: DataTypes.STRING,
      icon: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Amenity",
    }
  );
  return Amenity;
};
