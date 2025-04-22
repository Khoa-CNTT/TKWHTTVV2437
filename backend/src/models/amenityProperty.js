"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AmenityProperty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AmenityProperty.init(
    {
      idProperty: DataTypes.STRING,
      idAmenity: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AmenityProperty",
    }
  );
  return AmenityProperty;
};
