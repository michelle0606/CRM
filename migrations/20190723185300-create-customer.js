'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        allowNull: false,
        defaultValue: '尚未登錄',
        type: Sequelize.STRING
      },
      phoneNr: {
        allowNull: false,
        defaultValue: '尚未登錄',
        type: Sequelize.STRING
      },
      name: {
        allowNull: false,
        defaultValue: '尚未登錄',
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING,
        defaultValue: '尚未登錄'
      },
      gender: {
        type: Sequelize.STRING
      },
      age: {
        type: Sequelize.INTEGER
      },
      note: {
        type: Sequelize.TEXT
      },
      avatar: {
        type: Sequelize.STRING
      },
      ShopId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Customers')
  }
}
