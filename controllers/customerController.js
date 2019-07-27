const db = require('../models')
const Shop = db.Shop
const Customer = db.Customer

const customerController = {
  searchCustomer: (req, res) => {
    const phone_nr = req.query.phone_nr
    res.render('index', { title: '查詢會員', phone_nr })
  },

  addCustomer: (req, res) => {
    Customer.findOne({ where: { phoneNr: req.body.phone_nr } }).then(data => {
      if (!data)
        return Customer.create({ phoneNr: req.body.phone_nr }).then(
          customer => {
            return res.redirect(`/customers/${customer.id}`)
          }
        )
    })
  },

  getCustomer: (req, res) => {
    res.render('customer')
  },
  getAllCustomers: (req, res) => {
    Customer.findAll({ where: { ShopId: req.user.ShopId } }).then(customers => {
      res.render('allCustomers', { customers, title: '所有會員' })
    })
  },

  APIGetAllCustomers: (req, res) => {
    Customer.findAll({ where: { ShopId: req.user.ShopId } }).then(customers => {
      res.send(customers)
    })
  }
}

module.exports = customerController