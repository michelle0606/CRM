const moment = require('moment')
module.exports = {
  ifCond: function(a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  ifNotCond: function(a, b, options) {
    if (a !== b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  CompareNumber: function(a, b, options) {
    if (a < b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  moment: function(a) {
    return moment(a).format('MMM Do YY')
  }
}
