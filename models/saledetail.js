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
    SaleId: DataTypes.INTEGER,
    holdingTime: DataTypes.STRING
  }, {});
  SaleDetail.associate = function(models) {
    // associations can be defined here
    SaleDetail.belongsTo(models.Sale)
  };
  return SaleDetail;
};