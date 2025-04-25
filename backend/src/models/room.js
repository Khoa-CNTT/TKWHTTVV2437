"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Room.hasMany(models.ImageRoom, {
        foreignKey: "idRoom", // Khóa ngoại trong bảng imageRoom
        as: "images", // Alias để truy cập
      });

      Room.hasMany(models.Review, {
        foreignKey: "idRoom", // Khóa ngoại trong bảng imageRoom
        as: "reviews", // Alias để truy cập
      });

      Room.belongsTo(models.Property, {
        foreignKey: "idProperty", // Khóa ngoại trong bảng imageRoom
        as: "property", // Alias để truy cập
      });
      Room.hasMany(models.Reservation, {
        foreignKey: "idRoom", // hoặc tên khóa ngoại tương ứng
        as: "reservations", // Alias này phải đúng như trong phần include
      });

      Room.belongsToMany(models.Amenity, {
        through: "AmenityRoom", // Tên bảng trung gian
        foreignKey: "idRoom", // Khóa ngoại trong bảng trung gian trỏ đến Room
        otherKey: "idAmenity", // Khóa ngoại trong bảng trung gian trỏ đến Amenity
        as: "amenities", // Alias để truy cập
      });
    }
  }
  Room.init(
    {
      idProperty: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      maxPerson: DataTypes.INTEGER,
      deposit: DataTypes.DOUBLE,
      price: DataTypes.DOUBLE,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Room",
    }
  );
  return Room;
};
