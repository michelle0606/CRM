'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Products', 'inventory', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Products', 'inventory')
  }
}
