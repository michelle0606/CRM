'use strict'
module.exports = (sequelize, DataTypes) => {
  const PurchaseRecordDetail = sequelize.define(
    'PurchaseRecordDetail',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      quantity: DataTypes.INTEGER, //該產品當次進貨數量
      ProductId: DataTypes.INTEGER,
      PurchaseRecordId: DataTypes.INTEGER //屬於哪一次進貨紀錄
    },
    {}
  )
  PurchaseRecordDetail.associate = function(models) {
    // associations can be defined here
    PurchaseRecordDetail.belongsTo(models.PurchaseRecord)
  }
  return PurchaseRecordDetail
}
