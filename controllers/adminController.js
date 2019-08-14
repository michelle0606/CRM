const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const { User, Shop } = db
const imgur = require('imgur-node-api')

const adminController = {
  createShop: (req, res) => {
    return res.render('admin/createShop', { layout: 'adminLayout.hbs' })
  },

  postShop: (req, res) => {
    // console.log('in postShop')
    if (!req.body.name) {
      req.flash('error_messages', '需要有店名')
      return res.redirect('back')
    }
    const { file } = req // equal to const file = req.file
    if (file) {
      console.log('if file')
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Shop.create({
          name: req.body.name,
          phoneNr: req.body.phoneNr,
          email: req.body.email,
          address: req.body.address,
          logo: file ? img.data.link : null,
        }).then((shop) => {
          console.log('done creating')
          req.flash('success_messages', '新增成功')
          res.redirect('/admin/shops')
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
          res.redirect('/admin/shops')
        })
    }
  },

  getShops: (req, res) => {
    return Shop
      .findAll()
      .then(shops => {
        res.render('admin/shops', { layout: 'adminLayout.hbs', shops })
      })
  },

  getShop: (req, res) => {
    return Shop
      .findByPk(req.params.shop_id)
      .then(shop => {
        res.render('admin/shop', { layout: 'adminLayout.hbs', shop })
      })
  },

  editShop: (req, res) => {
    return Shop
      .findByPk(req.params.shop_id)
      .then(shop => {
        return res.render('admin/createShop', { layout: 'adminLayout.hbs', shop })
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
                res.redirect('/admin/shops')
                // res.redirect(`/admin/shops/${req.params.shop_id}`);
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
              res.redirect('/admin/shops')
              // res.redirect(`/admin/shops/${req.params.shop_id}`);
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
        return res.redirect('/admin/shops')
      })
  },

  createUser: (req, res) => {
    Shop.findAll().then(shops => {
      return res.render('admin/createUser', { layout: 'adminLayout.hbs', shops })
    })
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
          password: bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(10),
            null
          ),
          role: req.body.role,
          ShopId: req.body.ShopId,
          avatar: file ? img.data.link : null,
        }).then((user) => {
          req.flash('success_messages', '新增成功')
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
          req.flash('success_messages', '新增成功')
          res.redirect('/admin/users')
        })
    }
  },

  getUsers: (req, res) => {
    return User
      .findAll()
      .then(users => {
        res.render('admin/users', { layout: 'adminLayout.hbs', users })
      })
  },

  getUser: (req, res) => {
    return User
      .findByPk(req.params.user_id)
      .then(user => {
        res.render('admin/user', { layout: 'adminLayout.hbs', user })
      })
  },

  editUser: (req, res) => {
    return User
      .findByPk(req.params.user_id)
      .then(user => {
        Shop.findAll().then(shops => {
          return res.render('admin/createUser', { layout: 'adminLayout.hbs', profile: user, shops })
        })
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
                res.redirect('/admin/users')
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
              res.redirect('/admin/users')
              // res.redirect(`/admin/users/${req.params.user_id}`);
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
        return res.redirect('/admin/users')
      })
  },
}

module.exports = adminController
