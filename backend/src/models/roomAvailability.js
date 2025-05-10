"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RoomAvailability extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RoomAvailability.init(
    {
      idRoom: DataTypes.STRING,
      date: DataTypes.DATEONLY,
      blocked_quantity: DataTypes.INTEGER,
      idProperty: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "RoomAvailability",
      tableName: "RoomAvailabilities",
    }
  );
  return RoomAvailability;
};
