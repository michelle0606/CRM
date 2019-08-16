const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const { Shop, Customer, User, Product } = db
const imgur = require('imgur-node-api')

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
  },

  getShop: async (req, res) => {
    const shop = await Shop.findByPk(req.params.shop_id)
    return res.render('advance/shop', { layout: 'advanceLayout.hbs', shop })
  },

  editShop: async (req, res) => {
    const shop = await Shop.findByPk(req.params.shop_id)
    return res.render('advance/editShop', { layout: 'advanceLayout.hbs', shop })
  },

  putShop: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '需填店名');
      return res.redirect('back');
    }

    const { file } = req
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        Shop
          .findByPk(req.params.shop_id)
          .then((shop) => {
            shop
              .update({
                name: req.body.name,
                phoneNr: req.body.phoneNr,
                email: req.body.email,
                address: req.body.address,
                logo: file ? img.data.link : shop.logo,
              })
              .then(() => {
                req.flash('success_messages', '修改成功');
                res.redirect(`/advance/shops/${req.params.shop_id}`);
              });
          });
      });
    } else {
      Shop
        .findByPk(req.params.shop_id)
        .then((shop) => {
          shop
            .update({
              name: req.body.name,
              phoneNr: req.body.phoneNr,
              email: req.body.email,
              address: req.body.address,
              logo: shop.logo,
            })
            .then(() => {
              req.flash('success_messages', '修改成功');
              res.redirect(`/advance/shops/${req.params.shop_id}`);
            });
        });
    }
  },

  createSalesperson: (req, res) => {
    return res.render('advance/createUser', { layout: 'advanceLayout.hbs' })
  },

  postSalesperson: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '需要有名字')
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
          avatar: file ? img.data.link : null,
        })
        .then((user) => {
          req.flash('success_messages', '新增成功')
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
        ShopId: req.body.ShopId,
      })
      .then((user) => {
        req.flash('success_messages', '新增成功')
        res.redirect('/advance/users')
      })
    }
  },

  getUser: async (req, res) => {
    const user = await User.findByPk(req.params.user_id)
    return res.render('admin/user', { layout: 'advanceLayout.hbs', user })
  },

  editUser: async (req, res) => {
    const user = await User.findByPk(req.params.user_id)
    return res.render('advance/createUser', { layout: 'advanceLayout.hbs', profile: user })
  },

  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '需要有名字');
      return res.redirect('back');
    }

    const { file } = req
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        User
          .findByPk(req.params.user_id)
          .then((user) => {
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
                avatar: file ? img.data.link : user.avatar,
              })
              .then(() => {
                req.flash('success_messages', '修改成功');
                res.redirect('/advance/users')
                // res.redirect(`/admin/users/${req.params.user_id}`);
              });
          });
      });
    } else {
      User
        .findByPk(req.params.user_id)
        .then((user) => {
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
              avatar: user.avatar,
            })
            .then(() => {
              req.flash('success_messages', '修改成功');
              res.redirect('/advance/users')
              // res.redirect(`/admin/users/${req.params.user_id}`);
            });
        });
    }
  },

  deleteUser: async (req, res) => {
    await User.destroy({ where: { id: Number(req.params.salesperson_id) } })
    return res.redirect('/advance/users')
  },
}

module.exports = advanceController
