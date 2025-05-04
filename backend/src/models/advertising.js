"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Advertising extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Advertising.init(
    {
      name: DataTypes.STRING,
      icon: DataTypes.STRING,
      term: DataTypes.INTEGER,
      price: DataTypes.DOUBLE,
      type: DataTypes.INTEGER,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Advertising",
      tableName: "Advertising",
    }
  );
  return Advertising;
};
