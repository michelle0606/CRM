'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    role: DataTypes.INTEGER,
    ShopId: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Sale)
    User.belongsTo(models.Shop)
    User.hasMany(models.Return)
  };
  return User;
};