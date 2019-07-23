'use strict';
module.exports = (sequelize, DataTypes) => {
  const Shop = sequelize.define('Shop', {
    email: DataTypes.STRING,
    phoneNr: DataTypes.STRING,
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    logo: DataTypes.STRING
  }, {});
  Shop.associate = function(models) {
    // associations can be defined here
    Shop.hasMany(models.Tag)
    Shop.hasMany(models.Customer)
    Shop.hasMany(models.User)
    Shop.hasMany(models.Product)
    Shop.hasMany(models.Sale)
    Shop.hasMany(models.ExpirationDate)
  };
  return Shop;
};