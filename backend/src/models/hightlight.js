"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Highlight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Highlight.belongsTo(models.Property, {
      //   foreignKey: "idProperty", // Khóa ngoại trong bảng imageRoom
      //   as: "property", // Alias để truy cập
      // });
      Highlight.belongsToMany(models.Property, {
        through: "HighlightProperty", // Tên bảng trung gian
        foreignKey: "idHighlight", // Khóa ngoại trong bảng trung gian trỏ đến Room
        otherKey: "idProperty", // Khóa ngoại trong bảng trung gian trỏ đến Amenity
        as: "properties", // Alias để truy cập
      });
    }
  }
  Highlight.init(
    {
      name: DataTypes.STRING,
      icon: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Highlight",
    }
  );
  return Highlight;
};
