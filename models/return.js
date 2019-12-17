'use strict';
module.exports = (sequelize, DataTypes) => {
  const Return = sequelize.define('Return', {
    UserId: DataTypes.INTEGER,
    ShopId: DataTypes.INTEGER
  }, {});
  Return.associate = function(models) {
    // associations can be defined here
    Return.belongsToMany(models.Product, {
      as: 'associatedProducts',
      through: {
        model: models.ReturnDetail,
        unique: false
      },
      foreignKey: 'ReturnId'
    })
    Return.belongsTo(models.User)
    Return.belongsTo(models.Shop)
  };
  return Return;
};