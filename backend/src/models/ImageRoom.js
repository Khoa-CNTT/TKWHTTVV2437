"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ImageRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ImageRoom.belongsTo(models.Room, {
        foreignKey: "idRoom", // Khóa ngoại trong bảng imageRoom
        as: "room", // Alias để truy cập
      });
    }
  }
  ImageRoom.init(
    {
      image: DataTypes.STRING,
      idRoom: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ImageRoom",
    }
  );
  return ImageRoom;
};
