"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AccountPayment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AccountPayment.init(
    {
      numberAccount: DataTypes.STRING,
      nameAccount: DataTypes.STRING,
      nameBank: DataTypes.STRING,
      qrCode: DataTypes.STRING,
      idUser: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AccountPayment",
    }
  );
  return AccountPayment;
};
