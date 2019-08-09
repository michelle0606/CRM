const db = require('../models')
const User = db.User
const Shop = db.Shop
const imgur = require('imgur-node-api')

const adminController = {
  createShop: (req, res) => {
    return res.render('advance/createShop', { layout: 'advanceLayout.hbs' })
  },

  postShop: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '需要有店名')
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
          req.flash('success_messages', '新增成功')
          res.redirect('/advance/shops')
        })
      })
    } else {
      return Shop.create({
        name: req.body.name,
        phoneNr: req.body.phoneNr,
        email: req.body.email,
        address: req.body.address,
      })
        .then((shop) => {
          req.flash('success_messages', '新增成功')
          res.redirect('/advance/shops')
        })
    }
  },

  getShops: (req, res) => {
    return Shop
      .findAll()
      .then(shops => {
        res.render('advance/shops', { layout: 'advanceLayout.hbs', shops })
      })
  },

  getShop: (req, res) => {
    return Shop
      .findByPk(req.params.shop_id)
      .then(shop => {
        res.render('advance/shop', { layout: 'advanceLayout.hbs', shop })
      })
  },

  editShop: (req, res) => {
    return Shop
      .findByPk(req.params.shop_id)
      .then(shop => {
        return res.render('advance/createShop', { layout: 'advanceLayout.hbs', shop })
      })
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
                res.redirect('/advance/shops')
                // res.redirect(`/advance/shops/${req.params.shop_id}`);
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
              res.redirect('/advance/shops')
              // res.redirect(`/advance/shops/${req.params.shop_id}`);
            });
        });
    }
  },

  deleteShop: (req, res) => {
    return Shop
      .destroy({
        where: {
          id: Number(req.params.shop_id)
        }
      })
      .then(() => {
        return res.redirect('/advance/shops')
      })
  },

  createUser: (req, res) => {
    return res.render('advance/createUser', { layout: 'advanceLayout.hbs' })
  },

  postUser: (req, res) => {
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
          role: req.body.role,
          ShopId: req.body.ShopId,
          avatar: file ? img.data.link : null,
        }).then((user) => {
          req.flash('success_messages', '新增成功')
          res.redirect('/advance/users')
        })
      })
    } else {
      return User.create({
        name: req.body.name,
        role: req.body.role,
        ShopId: req.body.ShopId,
      })
        .then((user) => {
          req.flash('success_messages', '新增成功')
          res.redirect('/advance/users')
        })
    }
  },

  getUsers: (req, res) => {
    return User
      .findAll()
      .then(users => {
        res.render('advance/users', { layout: 'advanceLayout.hbs', users })
      })
  },

  getUser: (req, res) => {
    return User
      .findByPk(req.params.user_id)
      .then(user => {
        res.render('advance/user', { layout: 'advanceLayout.hbs', user })
      })
  },

  editUser: (req, res) => {
    return User
      .findByPk(req.params.user_id)
      .then(user => {
        return res.render('advance/createUser', { layout: 'advanceLayout.hbs', user })
      })
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
                role: req.body.role,
                ShopId: req.body.ShopId,
                avatar: file ? img.data.link : user.avatar,
              })
              .then(() => {
                req.flash('success_messages', '修改成功');
                res.redirect('/advance/users')
                // res.redirect(`/advance/users/${req.params.user_id}`);
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
              role: req.body.role,
              ShopId: req.body.ShopId,
              avatar: user.avatar,
            })
            .then(() => {
              req.flash('success_messages', '修改成功');
              res.redirect('/advance/users')
              // res.redirect(`/advance/users/${req.params.user_id}`);
            });
        });
    }
  },

  deleteUser: (req, res) => {
    return User
      .destroy({
        where: {
          id: Number(req.params.user_id)
        }
      })
      .then(() => {
        return res.redirect('/advance/users')
      })
  },
}

module.exports = adminController
