"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AdOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AdOrder.belongsTo(models.Property, {
        foreignKey: "idProperty",
        as: "property",
      });

      AdOrder.belongsTo(models.Advertising, {
        foreignKey: "idAdvertising",
        as: "advertising",
      });

      AdOrder.belongsTo(models.User, {
        foreignKey: "idUser",
        as: "user",
      });
    }
  }
  AdOrder.init(
    {
      idUser: DataTypes.STRING,
      idAdvertising: DataTypes.STRING,
      amount: DataTypes.DOUBLE,
      methodPay: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      status: DataTypes.STRING,
      idProperty: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AdOrder",
      tableName: "AdOrders",
    }
  );
  return AdOrder;
};
