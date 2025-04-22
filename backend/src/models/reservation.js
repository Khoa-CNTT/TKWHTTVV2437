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
      totalPrice: DataTypes.DOUBLE,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Reservation",
    }
  );
  return Reservation;
};
