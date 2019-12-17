'use strict';
module.exports = (sequelize, DataTypes) => {
  const ReturnDetail = sequelize.define('ReturnDetail', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: DataTypes.INTEGER,
    holdingTime: DataTypes.STRING,
    ProductId: DataTypes.INTEGER,
    ReturnId: DataTypes.INTEGER
  }, {});
  ReturnDetail.associate = function(models) {
    // associations can be defined here
  };
  return ReturnDetail;
};