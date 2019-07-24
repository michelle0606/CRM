'use strict';
module.exports = (sequelize, DataTypes) => {
  const CustomerDetail = sequelize.define('CustomerDetail', {
  	id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    CustomerId: DataTypes.INTEGER,
    TagId: DataTypes.INTEGER
  }, {});
  CustomerDetail.associate = function(models) {
    // associations can be defined here
  };
  return CustomerDetail;
};