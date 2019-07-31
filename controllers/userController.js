const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Shop = db.Shop

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup', {
      title: '開啟服務',
      error_messages: req.flash('error_messages')
    })
  },

  signUp: async (req, res) => {
    if (req.body.password2 !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else if (req.body.password.length < 8) {
      req.flash('error_messages', '密碼安全性不足！')
      return res.redirect('/signup')
    } else {
      Shop.findOne({
        where: { email: req.body.email }
      }).then(shop => {
        if (shop) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          Shop.create({
            name: req.body.name,
            email: req.body.email
          }).then(shop => {
            User.create({
              password: bcrypt.hashSync(
                req.body.password,
                bcrypt.genSaltSync(10),
                null
              ),
              role: 1,
              ShopId: shop.id
            }).then(() => {
              req.flash('success_messages', '成功註冊帳號！')
              return res.redirect('/login')
            })
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('login', {
      title: '登入',
      error_messages: req.flash('error_messages'),
      success_messages: req.flash('success_messages')
    })
  },

  signIn: (req, res) => {
    res.redirect('/')
  },

  logout: (req, res) => {
    req.logout()
    res.redirect('/login')
  }
}

module.exports = userController
