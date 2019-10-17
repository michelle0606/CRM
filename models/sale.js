'use strict'
module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define(
    'Sale',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      total: DataTypes.INTEGER,
      CustomerId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
      ShopId: DataTypes.INTEGER
    },
    {}
  )
  Sale.associate = function(models) {
    // associations can be defined here
    Sale.belongsToMany(models.Product, {
      as: 'associatedProducts',
      through: {
        model: models.SaleDetail,
        unique: false
      },
      foreignKey: 'SaleId'
    })
    Sale.belongsTo(models.Customer)
    Sale.belongsTo(models.User)
    Sale.belongsTo(models.Shop)
    Sale.hasMany(models.SaleDetail)
  }
  return Sale
}
