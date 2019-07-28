const db = require('../models')
const Shop = db.Shop
const Customer = db.Customer
const Product = db.Product

const tradeController = {
  getCustomerTradePage: (req, res) => {
    Customer.findOne({ where: { id: req.params.customers_id } }).then(customer => {
      res.render('trade', { customer })
    })
  },

  createNewTradeRecord: (req, res) => {
    res.send('good')
  },


  APIGetAllProducts: (req, res) => {
    Product.findAll().then(products => {
      res.send(products)
    })
  }
}

module.exports = tradeController