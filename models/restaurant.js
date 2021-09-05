'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    static associate(models) {
      Restaurant.belongsTo(models.Category) //關聯設定
      Restaurant.hasMany(models.Comment)
      Restaurant.belongsToMany(models.User, {  //多對多關係
      through: models.Favorite,
      foreignKey: 'RestaurantId',
      as: 'FavoritedUsers'
      })
    }
  };
  Restaurant.init({
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    address: DataTypes.STRING,
    opening_hours: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER,
    viewCounts: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Restaurant',
  });
  return Restaurant;
};