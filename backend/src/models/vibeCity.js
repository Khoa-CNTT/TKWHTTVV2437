"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class VibeCity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  VibeCity.init(
    {
      idVibe: DataTypes.STRING,
      idRoom: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "VibeCity",
    }
  );
  return VibeCity;
};
