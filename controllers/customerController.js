const db = require('../models')
const Shop = db.Shop
const Customer = db.Customer
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const customerController = {
  searchCustomer: (req, res) => {
    const phone_nr = req.query.phone_nr
    res.render('index', { title: '查詢會員', phone_nr })
  },

  addCustomer: (req, res) => {
    Customer.findOne({ where: { phoneNr: req.body.phone_nr } }).then(data => {
      if (!data) {
        return Customer.create({
          phoneNr: req.body.phone_nr,
          ShopId: req.user.ShopId
        }).then(customer => {
          return res.redirect(`/customers/${customer.id}`)
        })
      } else {
        return res.render('index', { error_messages: '此人已加入會員！' })
      }
    })
  },

  getCustomer: (req, res) => {
    return Customer.findByPk(req.params.customers_id).then(customer => {
      return res.render('customer', { customer, title: '會員資料' })
    })
  },

  editCustomerPage: (req, res) => {
    Customer.findByPk(req.params.customers_id).then(customer => {
      return res.render('editCustomer', { customer, title: '編輯資料' })
    })
  },

  putCustomer: (req, res) => {

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Customer.findByPk(req.params.customers_id).then(customer => {
          customer.update({
            email: req.body.email,
            phoneNr: req.body.phoneNr,
            name: req.body.name,
            address: req.body.address,
            gender: req.body.gender,
            age: req.body.age,
            avatar: file ? img.data.link : customer.avatar,
          }).then(customer => {
            res.redirect(`/customers/${req.params.customers_id}`)
          })
        })
      })
    } else {
      Customer.findByPk(req.params.customers_id).then(customer => {
        customer.update({
          email: req.body.email,
          phoneNr: req.body.phoneNr,
          name: req.body.name,
          address: req.body.address,
          gender: req.body.gender,
          age: req.body.age,
          avatar: customer.avatar,
        }).then(customer => {
          res.redirect(`/customers/${req.params.customers_id}`)
        })
      })
    }

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
