"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reservation.belongsTo(models.User, {
        foreignKey: "idUser", // Khóa ngoại trỏ đến Category
        as: "Users",
      });
      Reservation.belongsTo(models.Room, {
        foreignKey: "idRoom", // Khóa ngoại trong bảng Property
        as: "rooms", // Alias để truy cập
      });
      Reservation.hasMany(models.Payment, {
        foreignKey: "idReservation", // Khóa ngoại trong bảng imageRoom
        as: "Payments", // Alias để truy cập
      });
    }
  }
  Reservation.init(
    {
      idUser: DataTypes.STRING,
      idRoom: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      checkIndate: DataTypes.DATE,
      checkOutdate: DataTypes.DATE,
      numGuest: DataTypes.INTEGER,
      totalPrice: DataTypes.DOUBLE,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Reservation",
      tableName: "Reservations",
    }
  );
  return Reservation;
};
