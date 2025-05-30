"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RegisterPartner extends Model {
    static associate(models) {
      // define association here
      RegisterPartner.belongsTo(models.User, {
        foreignKey: "idUser", // Khóa ngoại trong bảng trung gian trỏ đến Summary
        as: "user", // Alias để truy cập
      });
    }
  }
  RegisterPartner.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: DataTypes.STRING,
      numberCCCD: DataTypes.STRING,
      beforeImage: DataTypes.STRING,
      afterImage: DataTypes.STRING,
      status: DataTypes.STRING,
      idUser: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "RegisterPartner",
      tableName: "RegisterPartners",
    }
  );
  return RegisterPartner;
};
