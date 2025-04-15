"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AddressVibe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AddressVibe.init(
    {
      addressId: DataTypes.STRING,
      vibeId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AddressVibe",
    }
  );

  return AddressVibe;
};
