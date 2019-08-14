'use strict'
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      name: DataTypes.STRING,
      manufacturer: DataTypes.STRING,
      category: DataTypes.STRING,
      purchasePrice: DataTypes.INTEGER,
      salePrice: DataTypes.INTEGER,
      image: DataTypes.STRING,
      ShopId: DataTypes.INTEGER,
      inventory: DataTypes.INTEGER,
      minimumStock: DataTypes.INTEGER
    },
    {}
  )
  Product.associate = function(models) {
    // associations can be defined here
    Product.belongsToMany(models.ExpirationDate, {
      as: 'associatedExpDates',
      through: {
        model: models.ProductExpDateDetail,
        unique: false
      },
      foreignKey: 'ProductId'
    })
    Product.belongsToMany(models.Sale, {
      as: 'associatedSales',
      through: {
        model: models.SaleDetail,
        unique: false
      },
      foreignKey: 'ProductId'
    })
    Product.belongsTo(models.Shop)
  }
  return Product
}
