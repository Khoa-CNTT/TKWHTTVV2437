"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.Room, {
        foreignKey: "idRoom", // Khóa ngoại trong bảng imageRoom
        as: "room", // Alias để truy cập
      });

      Review.belongsTo(models.Property, {
        foreignKey: "idProperty", // Khóa ngoại trong bảng imageRoom
        as: "property", // Alias để truy cập
      });
    }
  }
  Review.init(
    {
      idUser: DataTypes.STRING,
      idProperty: DataTypes.STRING,
      idRoom: DataTypes.STRING,
      rating: DataTypes.INTEGER,
      text: DataTypes.STRING,
      reviewDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
