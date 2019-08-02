const db = require('../models')
const Product = db.Product

const productController = {
  getInventory: (req, res) => {
    Product.findAll({ where: { ShopId: req.user.ShopId } }).then(products => {
      res.render('inventory', { title: '庫存管理', products })
    })
  }
}

module.exports = productController
