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
        as: "users",
      });
      Reservation.belongsTo(models.Room, {
        foreignKey: "idRoom", // Khóa ngoại trong bảng Property
        as: "rooms", // Alias để truy cập
      });
      Reservation.belongsTo(models.Property, {
        foreignKey: "idProperty", // Khóa ngoại trong bảng Property
        as: "properties", // Alias để truy cập
      });
      Reservation.hasMany(models.Payment, {
        foreignKey: "idReservation", // Khóa ngoại trong bảng imageRoom
        as: "payments", // Alias để truy cập
      });
    }
  }
  Reservation.init(
    {
      idUser: DataTypes.STRING,
      idRoom: DataTypes.STRING,
      // firstName: DataTypes.STRING,
      // lastName: DataTypes.STRING,
      // email: DataTypes.STRING,
      // phone: DataTypes.STRING,
      checkIndate: DataTypes.DATE,
      checkOutdate: DataTypes.DATE,
      numGuest: DataTypes.INTEGER,
      totalPrice: DataTypes.DOUBLE,
      status: DataTypes.STRING,
      message: DataTypes.STRING,
      nameAccount: DataTypes.STRING,
      numberAccount: DataTypes.STRING,
      nameBank: DataTypes.STRING,
      statusUser: DataTypes.STRING,
      returnImgBanking: DataTypes.STRING,
      code: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      imageBanking: DataTypes.STRING,
      reason: DataTypes.STRING,
      idProperty: DataTypes.STRING,
      statusLock: DataTypes.STRING,
      locked_until: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Reservation",
      tableName: "Reservations",
    }
  );
  return Reservation;
};
