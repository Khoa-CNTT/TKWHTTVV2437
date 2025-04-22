"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Property.hasMany(models.Room, {
        foreignKey: "idProperty", // Khóa ngoại trong bảng imageRoom
        as: "rooms", // Alias để truy cập
      });

      Property.hasMany(models.ImageProperty, {
        foreignKey: "idProperty", // Khóa ngoại trong bảng imageRoom
        as: "images", // Alias để truy cập
      });

      Property.hasMany(models.Review, {
        foreignKey: "idProperty", // Khóa ngoại trong bảng imageRoom
        as: "reviews", // Alias để truy cập
      });

      Property.belongsTo(models.City, {
        foreignKey: "idCity", // Khóa ngoại trong bảng imageRoom
        as: "city", // Alias để truy cập
      });

      Property.belongsToMany(models.Amenity, {
        through: "AmenityProperty", // Tên bảng trung gian
        foreignKey: "idProperty", // Khóa ngoại trong bảng trung gian trỏ đến Room
        otherKey: "idAmenity", // Khóa ngoại trong bảng trung gian trỏ đến Amenity
        as: "amenities", // Alias để truy cập
      });

      Property.belongsToMany(models.Highlight, {
        through: "HighlightProperty", // Tên bảng trung gian
        foreignKey: "idProperty", // Khóa ngoại trong bảng trung gian trỏ đến Room
        otherKey: "idHighlight", // Khóa ngoại trong bảng trung gian trỏ đến Amenity
        as: "highlights", // Alias để truy cập
      });

      Property.hasOne(models.Address, {
        foreignKey: "idProperty", // Khóa ngoại trong bảng imageRoom
        as: "propertyAddress", // Alias để truy cập
      });
    }
  }
  Property.init(
    {
      idUser: DataTypes.STRING,
      idCategory: DataTypes.STRING,
      idCity: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      address: DataTypes.STRING,
      slug: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Property",
    }
  );
  return Property;
};
