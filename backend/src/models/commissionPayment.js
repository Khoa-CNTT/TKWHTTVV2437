"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CommissionPayment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CommissionPayment.init(
    {
      idUser: DataTypes.STRING,
      idProperty: DataTypes.STRING,
      month: DataTypes.INTEGER,
      year: DataTypes.INTEGER,
      totalRevenue: DataTypes.DOUBLE,
      commissionAmount: DataTypes.DOUBLE,
      commissionRate: DataTypes.DOUBLE,
      status: DataTypes.STRING,
      paymentDate: DataTypes.DATE,
      methodPay: DataTypes.STRING,
      orderQuantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CommissionPayment",
      tableName: "CommissionPayments",
    }
  );
  return CommissionPayment;
};
