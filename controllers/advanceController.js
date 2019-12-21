const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const { Shop, Customer, User, Product } = db
const imgur = require('imgur-node-api')

const advanceController = {
  getAllCustomers: (req, res) => {
    Customer.findAll({ where: { ShopId: req.user.ShopId } }).then(customers => {
      res.render('advance/advanceCustomers', {
        layout: 'advanceLayout.hbs',
        customers,
        title: '客戶管理'
      })
    })
  },

  getCustomer: (req, res) => {
    Customer.findByPk(req.params.customers_id).then(customer => {
      res.render('advance/advanceCustomer', {
        layout: 'advanceLayout.hbs',
        customer
      })
    })
  },

  getAllProducts: (req, res) => {
    Product.findAll({ where: { ShopId: req.user.ShopId } }).then(products => {
      res.render('advance/advanceProducts', {
        layout: 'advanceLayout.hbs',
        products,
        title: '商品管理'
      })
    })
  },

  editAllProducts: (req, res) => {
    Product.findAll({ where: { ShopId: req.user.ShopId } }).then(products => {
      res.render('advance/advanceProductsEdit', {
        layout: 'advanceLayout.hbs',
        products,
        title: '商品資料編輯'
      })
    })
  },

  putProducts: (req, res) => {
    const idArray = req.body.id
    const nameArray = req.body.name
    const priceArray = req.body.price
    const inventoryArray = req.body.inventory
    const minimumStockArray = req.body.minimumStock
    const { files } = req
    if (priceArray.some(a => Number(a) <= 0)) {
      req.flash('top_messages', '價格不能小於等於0, 請重新輸入')
      return res.render('back')
    }
    if (inventoryArray.some(a => Number(a) < 0)) {
      req.flash('top_messages', '庫存不能小於0, 請重新輸入')
      return res.redirect('back')
    }
    if (files) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
    }
    if (minimumStockArray.some(a => Number(a) < 0)) {
      req.flash('top_messages', '庫存警示需大於0, 請重新輸入')
      return res.redirect('back')
    } else {
      for (let i = 0; i < idArray.length; i++) {
        imgur.upload(files[i].path, (err, img) => {
          Product.findByPk(idArray[i]).then(product => {
            product.update({
              salePrice: priceArray[i],
              name: nameArray[i],
              inventory: inventoryArray[i],
              minimumStock: minimumStockArray[i],
              image: files[i] ? img.data.link : product.image
            })
          })
        })
      }
      res.redirect('/advance/products')
    }
  },

  getAllSales: (req, res) => {
    User.findAll({ where: { ShopId: req.user.ShopId } }).then(sales => {
      res.render('advance/sales', {
        layout: 'advanceLayout.hbs',
        sales,
        title: '人事管理'
      })
    })
  },

  getShop: async (req, res) => {
    const shop = await Shop.findByPk(req.params.shop_id)
    return res.render('advance/shop', {
      layout: 'advanceLayout.hbs',
      shop,
      title: '店鋪管理'
    })
  },

  editShop: async (req, res) => {
    const shop = await Shop.findByPk(req.params.shop_id)
    return res.render('advance/editShop', {
      layout: 'advanceLayout.hbs',
      shop,
      title: '店鋪資料編輯'
    })
  },

  putShop: (req, res) => {
    if (!req.body.name) {
      req.flash('top_messages', '需要提供店名！')
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        Shop.findByPk(req.params.shop_id).then(shop => {
          shop
            .update({
              name: req.body.name,
              phoneNr: req.body.phoneNr,
              email: req.body.email,
              address: req.body.address,
              logo: file ? img.data.link : shop.logo
            })
            .then(() => {
              // req.flash('success_messages', '修改成功');
              res.redirect(`/advance/shops/${req.params.shop_id}`)
            })
        })
      })
    } else {
      Shop.findByPk(req.params.shop_id).then(shop => {
        shop
          .update({
            name: req.body.name,
            phoneNr: req.body.phoneNr,
            email: req.body.email,
            address: req.body.address,
            logo: shop.logo
          })
          .then(() => {
            // req.flash('success_messages', '修改成功');
            res.redirect(`/advance/shops/${req.params.shop_id}`)
          })
      })
    }
  },

  createSalesperson: (req, res) => {
    return res.render('advance/createUser', {
      layout: 'advanceLayout.hbs',
      title: '新增使用者'
    })
  },

  postSalesperson: (req, res) => {
    if (!req.body.name) {
      req.flash('top_messages', '需要提供店員名字！')
      return res.redirect('back')
    }
    if (req.body.password !== req.body.password2) {
      req.flash('top_messages', '兩次輸入密碼不同！')
      return res.redirect('back')
    }
    if (req.body.password.length < 8) {
      req.flash('top_messages', '請提供長度8以上之密碼！')
      return res.redirect('back')
    }

    const { file } = req // equal to const file = req.file
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.create({
          name: req.body.name,
          password: bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(10),
            null
          ),
          role: req.body.role,
          ShopId: req.body.ShopId,
          avatar: file ? img.data.link : null
        }).then(user => {
          // req.flash('success_messages', '新增成功')
          res.redirect('/advance/users')
        })
      })
    } else {
      return User.create({
        name: req.body.name,
        password: bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(10),
          null
        ),
        role: req.body.role,
        ShopId: req.body.ShopId
      }).then(user => {
        // req.flash('success_messages', '新增成功')
        res.redirect('/advance/users')
      })
    }
  },

  getUser: async (req, res) => {
    const user = await User.findByPk(req.params.user_id)
    return res.render('admin/user', {
      layout: 'advanceLayout.hbs',
      user,
      title: '人員資料'
    })
  },

  editUser: async (req, res) => {
    const user = await User.findByPk(req.params.user_id)
    return res.render('advance/createUser', {
      layout: 'advanceLayout.hbs',
      profile: user,
      title: '人員資料編輯'
    })
  },

  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('top_messages', '需要提供店員名字！')
      return res.redirect('back')
    }
    if (req.body.password !== req.body.password2) {
      req.flash('top_messages', '兩次輸入密碼不同！')
      return res.redirect('back')
    }
    if (req.body.password.length < 8) {
      req.flash('top_messages', '請提供長度8以上之密碼！')
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        User.findByPk(req.params.user_id).then(user => {
          user
            .update({
              name: req.body.name,
              password: bcrypt.hashSync(
                req.body.password,
                bcrypt.genSaltSync(10),
                null
              ),
              role: req.body.role,
              ShopId: req.body.ShopId,
              avatar: file ? img.data.link : user.avatar
            })
            .then(() => {
              // req.flash('success_messages', '修改成功');
              res.redirect('/advance/users')
            })
        })
      })
    } else {
      User.findByPk(req.params.user_id).then(user => {
        user
          .update({
            name: req.body.name,
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10),
              null
            ),
            role: req.body.role,
            ShopId: req.body.ShopId,
            avatar: user.avatar
          })
          .then(() => {
            // req.flash('success_messages', '修改成功');
            res.redirect('/advance/users')
          })
      })
    }
  },

  deleteUser: async (req, res) => {
    await User.destroy({ where: { id: Number(req.params.salesperson_id) } })
    return res.redirect('/advance/users')
  }
}

module.exports = advanceController
