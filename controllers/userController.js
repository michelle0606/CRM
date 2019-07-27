const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Shop = db.Shop

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup', { title: '開啟服務' })
  },

  signUp: (req, res) => {
    if (req.body.password2 !== req.body.password) {
      // req.flash('error_messages', '兩次密碼輸入不同！')
      console.log('兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      Shop.findOne({
        where: { email: req.body.email }
      }).then(shop => {
        if (shop) {
          // req.flash('error_messages', '信箱重複！')
          console.log('信箱重複！')
          // console.log(res.locals)
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
            }).then(user => {
              // req.flash('success_messages', '成功註冊帳號！')
              console.log('成功註冊帳號！')
              return res.redirect('/login')
            })
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('login', { title: '登入' })
  },

  signIn: (req, res) => {
    const shop_id = req.user.ShopId
    // console.log(req.session.passport.user)
    // req.flash('success_messages', '成功登入！')
    console.log('success_messages', '成功登入！')
    res.redirect(`/shop/${shop_id}`)
  },

  logout: (req, res) => {
    // req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/login')
  }
}

module.exports = userController
