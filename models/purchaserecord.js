'use strict'
module.exports = (sequelize, DataTypes) => {
  const PurchaseRecord = sequelize.define(
    'PurchaseRecord',
    {
      UserId: DataTypes.INTEGER,
      ShopId: DataTypes.INTEGER
    },
    {}
  )
  PurchaseRecord.associate = function(models) {
    PurchaseRecord.belongsToMany(models.Product, {
      as: 'associatedProducts',
      through: {
        model: models.PurchaseRecordDetail,
        unique: false
      },
      foreignKey: 'PurchaseRecordId'
    })
    PurchaseRecord.belongsTo(models.User)
    PurchaseRecord.belongsTo(models.Shop)
    PurchaseRecord.hasMany(models.PurchaseRecordDetail)
  }
  return PurchaseRecord
}
