"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Address.belongsTo(models.Property, {
        foreignKey: "idProperty",
        as: "property",
      });
    }
  }
  Address.init(
    {
      street: DataTypes.STRING,
      city: DataTypes.STRING,
      district: DataTypes.STRING,
      ward: DataTypes.STRING,
      country: DataTypes.STRING,
      idProperty: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Address",
      tableName: "Address",
    }
  );
  return Address;
};
