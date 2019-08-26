'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Products', 'minimumStock', {
      type: Sequelize.INTEGER,
      defaultValue: 20
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Products', 'minimumStock')
  }
}
