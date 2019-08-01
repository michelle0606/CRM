const db = require('../models')
const Product = db.Product

const productController = {
  getInventory: (req, res) => {
    res.render('inventory')
  }
}

module.exports = productController
