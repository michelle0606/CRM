const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const { User, Shop } = db
const imgur = require('imgur-node-api')

const adminController = {
  createShop: (req, res) => {
    return res.render('admin/createShop', { layout: 'adminLayout.hbs' })
  },

  postShop: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '需要提供店名！')
      return res.redirect('back')
    }
    const { file } = req // equal to const file = req.file
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Shop.create({
          name: req.body.name,
          phoneNr: req.body.phoneNr,
          email: req.body.email,
          address: req.body.address,
          logo: file ? img.data.link : null,
        }).then((shop) => {
          // req.flash('success_messages', '新增成功')
          res.redirect('/admin/shops')
        })
      })
    } else {
      return Shop.create({
        name: req.body.name,
        phoneNr: req.body.phoneNr,
        email: req.body.email,
        address: req.body.address,
      }).then((shop) => {
        // req.flash('success_messages', '新增成功')
        res.redirect('/admin/shops')
      })
    }
  },

  getShops: async (req, res) => {
    const shops = await Shop.findAll()
    return res.render('admin/shops', { layout: 'adminLayout.hbs', shops })
  },

  getShop: async (req, res) => {
    const shop = await Shop.findByPk(req.params.shop_id)
    return res.render('admin/shop', { layout: 'adminLayout.hbs', shop })
  },

  editShop: async (req, res) => {
    const shop = await Shop.findByPk(req.params.shop_id)
    return res.render('admin/createShop', { layout: 'adminLayout.hbs', shop })
  },

  putShop: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '需要提供店名！');
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
                // req.flash('success_messages', '修改成功');
                res.redirect('/admin/shops')
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
              // req.flash('success_messages', '修改成功');
              res.redirect('/admin/shops')
            });
        });
    }
  },

  deleteShop: async (req, res) => {
    await Shop.destroy({ where: { id: Number(req.params.shop_id) } })
    return res.redirect('/admin/shops')
  },

  createUser: async (req, res) => {
    const shops = await Shop.findAll()
    return res.render('admin/createUser', { layout: 'adminLayout.hbs', shops })
  },

  postUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '需要提供店員名字！')
      return res.redirect('back')
    }
    if (req.body.password !== req.body.password2) {
      req.flash('error_messages', '兩次輸入密碼不同！')
      return res.redirect('back')
    }
    if (req.body.password.length < 8) {
      req.flash('error_messages', '請提供長度8以上之密碼！')
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
        }).then((user) => {
          // req.flash('success_messages', '新增成功')
          res.redirect('/admin/users')
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
          // req.flash('success_messages', '新增成功')
          res.redirect('/admin/users')
        })
    }
  },

  getUsers: async (req, res) => {
    const users = await User.findAll()
    return res.render('admin/users', { layout: 'adminLayout.hbs', users })
  },

  getUser: async (req, res) => {
    const user = await User.findByPk(req.params.user_id)
    return res.render('admin/user', { layout: 'adminLayout.hbs', user })
  },

  editUser: async (req, res) => {
    const user = await User.findByPk(req.params.user_id)
    const shops = await Shop.findAll()
    return res.render('admin/createUser', { layout: 'adminLayout.hbs', profile: user, shops })
  },

  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '需要提供店員名字！');
      return res.redirect('back');
    }
    if (req.body.password !== req.body.password2) {
      req.flash('error_messages', '兩次輸入密碼不同！')
      return res.redirect('back')
    }
    if (req.body.password.length < 8) {
      req.flash('error_messages', '請提供長度8以上之密碼！')
      return res.redirect('back')
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
                // req.flash('success_messages', '修改成功');
                res.redirect('/admin/users')
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
              // req.flash('success_messages', '修改成功');
              res.redirect('/admin/users')
            });
        });
    }
  },

  deleteUser: async (req, res) => {
    await User.destroy({ where: { id: Number(req.params.user_id) } })
    return res.redirect('/admin/users')
  },
}

module.exports = adminController
