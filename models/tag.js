'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    tag: DataTypes.STRING,
    ShopId: DataTypes.INTEGER
  }, {});
  Tag.associate = function(models) {
    // associations can be defined here
    Tag.belongsToMany(models.Customer, {
      as: 'associatedCustomers', 
      through: { 
        model: models.CustomerDetail, 
        unique: false 
      }, 
      foreignKey: 'TagId'
    })
    Tag.belongsTo(models.Shop)
  };
  return Tag;
};