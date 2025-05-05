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
      // define association here
      Reservation.belongsTo(models.Room, {
        foreignKey: "idRoom", // Khóa ngoại trong bảng imageRoom
        as: "rooms", // Alias để truy cập
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
      imageBanking: DataTypes.STRING,
      checkIndate: DataTypes.DATE,
      checkOutdate: DataTypes.DATE,
      numGuest: DataTypes.INTEGER,
      deposit: DataTypes.DOUBLE,
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
