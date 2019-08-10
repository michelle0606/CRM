'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Customers', 'receiveEmail', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Customers', 'receiveEmail')
  }
}
