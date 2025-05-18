"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      models.User.hasMany(models.Review, {
        foreignKey: "idUser",
        as: "reviews",
      });

      models.User.hasOne(models.RegisterPartner, {
        foreignKey: "idUser",
        as: "user",
      });

      models.User.hasMany(models.Property, {
        foreignKey: "idUser",
        as: "properties",
      });
      models.User.hasMany(models.Reservation, {
        foreignKey: "idUser",
        as: "reservations",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      avatar: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      bio: DataTypes.STRING,
      gender: DataTypes.STRING,
      dateOfBirth: DataTypes.DATE,
      emergencyPhone: DataTypes.STRING,
      address: DataTypes.STRING,
      role: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
