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
  },
  times: function(n, block) {
    let accum = ''
    for (let i = 0; i < n; ++i) accum += block.fn(i)
    return accum
  }
}
