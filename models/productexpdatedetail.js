'use strict'
module.exports = (sequelize, DataTypes) => {
  const ProductExpDateDetail = sequelize.define(
    'ProductExpDateDetail',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      ProductId: DataTypes.INTEGER,
      ExpirationDateId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER
    },
    {}
  )
  ProductExpDateDetail.associate = function(models) {
    // associations can be defined here
  }
  return ProductExpDateDetail
}
