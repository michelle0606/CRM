const db = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const { Sale, User, Product, Customer, CustomerDetail, Tag } = db

const customerController = {
  createCustomerPage: (req, res) => {
    res.render('index', { title: '新增會員' })
  },

  addCustomer: (req, res) => {
    Customer.findOne({ where: { phoneNr: req.body.phone_nr } }).then(data => {
      if (!data) {
        return Customer.create({
          phoneNr: req.body.phone_nr,
          ShopId: req.user.ShopId
        }).then(customer => {
          req.flash('top_messages', '成功新增會員！')
          res.redirect(`/customers/${customer.id}`)
        })
      } else {
        req.flash('top_messages', '此人之前已經加入會員！')
        res.redirect(`/customers/${data.id}`)
      }
    })
  },

  getCustomer: (req, res) => {
    const id = req.params.customers_id
    return Customer.findByPk(id, {
      include: {
        model: Tag,
        as: 'associatedTags'
      }
    }).then(customer => {
      const tags = customer.associatedTags
      return res.render('customer', { customer, tags, title: '會員資料' })
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
          customer
            .update({
              email: req.body.email,
              phoneNr: req.body.phoneNr,
              name: req.body.name,
              address: req.body.address,
              gender: req.body.gender,
              age: req.body.age,
              avatar: file ? img.data.link : customer.avatar
            })
            .then(customer => {
              res.redirect(`/customers/${req.params.customers_id}`)
            })
        })
      })
    } else {
      Customer.findByPk(req.params.customers_id).then(customer => {
        customer
          .update({
            email: req.body.email,
            phoneNr: req.body.phoneNr,
            name: req.body.name,
            address: req.body.address,
            gender: req.body.gender,
            age: req.body.age,
            avatar: customer.avatar
          })
          .then(customer => {
            res.redirect(`/customers/${req.params.customers_id}`)
          })
      })
    }
  },

  getRecords: (req, res) => {
    Customer.findByPk(req.params.customers_id, {
      include: [
        {
          model: Sale,
          include: [User, { model: Product, as: 'associatedProducts' }]
        }
      ]
    }).then(customer => {
      let totalPrice = 0
      customer.Sales.forEach(sale => {
        totalPrice += sale.total
      })

      res.render('record', { customer, title: '交易紀錄', totalPrice })
    })
  },

  getAllCustomers: (req, res) => {
    Customer.findAll({
      where: { ShopId: req.user.ShopId }
    }).then(customers => {
      res.render('allCustomers', { customers, title: '查詢會員' })
    })
  },

  APIGetAllCustomers: (req, res) => {
    Customer.findAll({ where: { ShopId: req.user.ShopId } }).then(customers => {
      res.send(customers)
    })
  }
}

module.exports = customerController
