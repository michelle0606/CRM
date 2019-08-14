const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const { User, Shop } = db

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup', {
      layout: 'preLayout.hbs',
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
      layout: 'preLayout.hbs',
      title: '登入'
    })
  },

  signIn: (req, res) => {
    res.redirect('/customers/create')
  },

  logout: (req, res) => {
    req.logout()
    res.redirect('/login')
  },

  forgotPage: (req, res) => {
    res.render('forgot', {
      layout: 'preLayout.hbs',
      title: '忘記密碼'
    })
  },

  getNewPassword: async (req, res) => {
    const user = await User.findOne({ where: { id: req.body.id } })

    if (!user) {
      req.flash('error_messages', '編號不存在')
      return res.redirect('/forgot')
    } else if (req.body.password2 !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/forgot')
    } else if (req.body.password.length < 8) {
      req.flash('error_messages', '密碼安全性不足！')
      return res.redirect('/forgot')
    } else if (user.name !== req.body.name) {
      req.flash('error_messages', '名字錯誤')
      return res.redirect('/forgot')
    } else {
      user
        .update({
          password: bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(10),
            null
          )
        })
        .then(() => {
          req.flash('success_messages', '成功修改密碼！')
          return res.redirect('/login')
        })
    }
  },

  //user edit own information
  privacyInfoPage: (req, res) => {
    User.findByPk(req.params.id).then(user => {
      res.render('privacy', { user })
    })
  },

  editPrivacyInfo: (req, res) => {
    User.findByPk(req.params.id).then(user => {
      if (!bcrypt.compareSync(req.body.oldPassword, user.password)) {
        req.flash('error_messages', '密碼錯誤')
        res.redirect('back')
      } else {
        if (req.body.confirmPassword !== req.body.newPassword) {
          req.flash('error_messages', '兩次密碼不同')
          res.redirect('back')
        } else {
          user
            .update({
              password: bcrypt.hashSync(
                req.body.newPassword,
                bcrypt.genSaltSync(10),
                null
              )
            })
            .then(user => {
              req.flash('success_messages', '密碼更新成功')
              return res.redirect('back')
            })
        }
      }
    })
  }
}

module.exports = userController
