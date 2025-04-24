"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Summary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Summary.belongsToMany(models.Room, {
        through: "SummaryRoom", // Tên bảng trung gian
        foreignKey: "idSummary", // Khóa ngoại trong bảng trung gian trỏ đến Summary
        otherKey: "idRoom", // Khóa ngoại trong bảng trung gian trỏ đến Room
        as: "rooms", // Alias để truy cập
      });
    }
  }
  Summary.init(
    {
      name: DataTypes.STRING,
      icon: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Summary",
      table: "Summaries"
    }
  );
  return Summary;
};
