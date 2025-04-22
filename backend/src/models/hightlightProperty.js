"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HighlightProperty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // HighlightProperty.belongsTo(models.Property, {
      //   foreignKey: "idProperty", // Khóa ngoại trong bảng imageRoom
      //   as: "property", // Alias để truy cập
      // });
    }
  }
  HighlightProperty.init(
    {
      idHighlight: DataTypes.STRING,
      idProperty: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "HighlightProperty",
      tableName: "HighlightProperties"
    }
  );
  return HighlightProperty;
};
