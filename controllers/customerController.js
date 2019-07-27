const db = require('../models')
const Shop = db.Shop
const Customer = db.Customer

const customerController = {
  getAllCustomers: (req, res) => {
    Customer.findAll({ where: { ShopId: req.user.ShopId } }).then(customers => {
      res.render('allMembers', { customers })
    })
  }
}

module.exports = customerController
