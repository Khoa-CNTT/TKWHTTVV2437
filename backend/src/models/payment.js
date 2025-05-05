"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Payment.belongsTo(models.User, {
        foreignKey: "idUser", // Khóa ngoại trỏ đến Category
        as: "Users",
      });
      Payment.belongsTo(models.Reservation, {
        foreignKey: "idReservation", 
        as: "Reservations", // Tên alias PHẢI GIỮ NGUYÊN khi query
      });
      // define association here
    }
  }
  Payment.init(
    {
      idReservation: DataTypes.STRING,
      paymentDate: DataTypes.STRING,
      paymentMethod: DataTypes.STRING,
      paymentStatus: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      idUser: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Payment",
    }
  );
  return Payment;
};
