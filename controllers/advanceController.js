const db = require('../models')
const { Shop, Customer, User, Product } = db


const advanceController = {
  getAllCustomers: (req, res) => {
    Customer.findAll().then(customers => {
      res.render('advance/advanceCustomers', { layout: 'advanceLayout.hbs', customers })
    })
  },

  getCustomer: (req, res) => {
    Customer.findByPk(req.params.customers_id).then(customer => {
      res.render('advance/advanceCustomer', { layout: 'advanceLayout.hbs', customer })
    })
  },

  getAllProducts: (req, res) => {
    Product.findAll().then(products => {
      res.render('advance/advanceProducts', { layout: 'advanceLayout.hbs', products })
    })
  },

  getAllSales: (req, res) => {
    console.log(req.user.ShopId)
    User.findAll({ where: { ShopId: req.user.ShopId } }).then(sales => {
      res.render('advance/sales', { layout: 'advanceLayout.hbs', sales })
    })
  }
}

module.exports = advanceController