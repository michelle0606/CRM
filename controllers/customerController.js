const db = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const { Sale, User, Product, Customer, CustomerDetail, Tag } = db

const customerController = {
  getHomePage: (req, res) => {
    res.redirect('/customers/create')
  },

  createCustomerPage: async (req, res) => {
    res.render('index', { title: '新增會員' })
    // const lastNubmer = 100000 + req.user.ShopId
    // const directBuy = await Customer.findByPk(lastNubmer)

    // if (directBuy === null) {
    //   Customer.create({
    //     id: lastNubmer,
    //     name: '非會員',
    //     ShopId: req.user.ShopId,
    //     email: '',
    //     phoneNr: '',
    //     receiveEmail: false,
    //     birthday: '2019-01-01'
    //   }).then(directBuy => {
    //     res.render('index', { title: '新增會員', directBuy })
    //   })
    // } else {
    //   res.render('index', { title: '新增會員', directBuy })
    // }
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
      const allTags = customer.associatedTags ? customer.associatedTags : []

      const tags = []

      for (i = 0; i < allTags.length; i++) {
        if (tags.indexOf(allTags[i].tag) < 0) {
          tags.push(allTags[i].tag)
        }
      }

      if (customer.note) {
        customer.note = customer.note.slice(0, 20) + '...'
      }

      return res.render('customer', { customer, tags, title: '會員資料' })
    })
  },

  editCustomerPage: (req, res) => {
    Customer.findByPk(req.params.customers_id).then(customer => {
      const d = new Date(customer.birthday)
      let month = ''
      let day = ''

      if (d.getMonth() < 10) {
        month = `0${d.getMonth() + 1}`
      } else {
        month = d.getMonth() + 1
      }

      if (d.getDate() < 10) {
        day = `0${d.getDate() + 1}`
      } else {
        day = d.getDate()
      }
      const date = `${d.getFullYear()}-${month}-${day}`

      return res.render('editCustomer', { customer, date, title: '編輯資料' })
    })
  },

  putCustomer: (req, res) => {
    Customer.findByPk(req.params.customers_id).then(customer => {
      customer
        .update({
          email: req.body.email,
          phoneNr: req.body.phoneNr,
          name: req.body.name,
          address: req.body.address,
          gender: req.body.gender,
          birthday: req.body.birthday,
          receiveEmail: req.body.receiveEmail,
          note: req.body.note
        })
        .then(() => {
          res.redirect(`/customers/${req.params.customers_id}`)
        })
    })
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
    Customer.findAll({
      where: { ShopId: req.user.ShopId },
      include: { model: Tag, as: 'associatedTags' }
    }).then(customers => {
      res.send(customers)
    })
  },

  APIGetCustomerInfo: (req, res) => {
    const id = req.params.customers_id
    Customer.findByPk(id, {
      include: [
        {
          model: Sale,
          include: [User, { model: Product, as: 'associatedProducts' }]
        }
      ]
    }).then(customer => {
      res.send(customer)
    })
  }
}

module.exports = customerController
