'use strict';
module.exports = (sequelize, DataTypes) => {
  const SaleDetail = sequelize.define('SaleDetail', {
  	id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER,
    SaleId: DataTypes.INTEGER
  }, {});
  SaleDetail.associate = function(models) {
    // associations can be defined here
  };
  return SaleDetail;
};