'use strict';
module.exports = (sequelize, DataTypes) => {
  const ExpirationDate = sequelize.define('ExpirationDate', {
    expDate: DataTypes.STRING,
    ShopId: DataTypes.INTEGER
  }, {});
  ExpirationDate.associate = function(models) {
    // associations can be defined here
    ExpirationDate.belongsToMany(models.Product, {
      as: 'associatedProducts', 
      through: { 
        model: models.ProductExpDateDetail, 
        unique: false 
      }, 
      foreignKey: 'ExpirationDateId'
    })
    ExpirationDate.belongsTo(models.Shop)
  };
  return ExpirationDate;
};