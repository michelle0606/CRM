'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Customers', 'birthday', {
      type: Sequelize.DATE,
      allowNull: true
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Customers', 'birthday')
  }
}
