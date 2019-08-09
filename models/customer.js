'use strict'
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    'Customer',
    {
      email: DataTypes.STRING,
      phoneNr: DataTypes.STRING,
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      gender: DataTypes.STRING,
      age: DataTypes.INTEGER,
      note: DataTypes.TEXT,
      avatar: DataTypes.STRING,
      ShopId: DataTypes.INTEGER,
      birthday: DataTypes.DATE
    },
    {}
  )
  Customer.associate = function(models) {
    // associations can be defined here
    Customer.belongsToMany(models.Tag, {
      as: 'associatedTags',
      through: {
        model: models.CustomerDetail,
        unique: false
      },
      foreignKey: 'CustomerId'
    })
    Customer.hasMany(models.Sale)
    Customer.belongsTo(models.Shop)
  }
  return Customer
}
