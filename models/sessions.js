'use strict'
module.exports = (sequelize, DataTypes) => {
  const Sessions = sequelize.define(
    'Sessions',
    {
      sid: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING
      },
      userId: DataTypes.STRING,
      expires: DataTypes.DATE,
      data: DataTypes.STRING,
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date()
      }
    },
    {}
  )
  Sessions.associate = function(models) {
    // associations can be defined here
  }
  return Sessions
}
