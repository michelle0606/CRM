const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const { User, Shop, Product, Customer } = db

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup', {
      layout: 'preLayout.hbs',
      title: '開啟服務'
    })
  },

  signUp: async (req, res) => {
    const { name, email, password, password2 } = req.body
    if (password2 !== password) {
      return res.render('signup', {
        name,
        email,
        password,
        password2,
        error_messages: '兩次密碼輸入不同！'
      })
    } else if (password.length < 8) {
      return res.render('signup', {
        name,
        email,
        password,
        password2,
        error_messages: '密碼安全性不足，請重新輸入！'
      })
    } else {
      const oldShop = await Shop.findOne({ where: { email: email } })
      if (oldShop) {
        return res.render('signup', {
          name,
          email,
          password,
          password2,
          error_messages: '信箱重複！'
        })
      } else {
        const newShop = await Shop.create({ name: name, email: email })
        const newUser = await User.create({
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
          role: 1,
          ShopId: newShop.id
        })
        if (newUser) {
          req.flash('success_messages', '成功註冊帳號！')
          return res.redirect('/login')
        }
      }
    }
  },

  signInPage: (req, res) => {
    return res.render('login', {
      layout: 'preLayout.hbs',
      title: '登入'
    })
  },

  signIn: async (req, res) => {
    const lastNubmer = 100000 + req.user.ShopId
    const directBuy = await Customer.findByPk(lastNubmer)
    let flag = 0
    const products = await Product.findAll({
      where: { 
        ShopId: req.user.ShopId
      }
    })
    const alertItem = products.filter(
      product => product.inventory < product.minimumStock
    )

    if (alertItem.length > 0) flag = 1
    if (directBuy === null) {
      directBuy = await Customer.create({
        id: lastNubmer,
        name: '非會員',
        ShopId: req.user.ShopId,
        email: '',
        phoneNr: '',
        receiveEmail: false,
        birthday: '2019-01-01',
      })
    }
    res.render('index', { title: '新增會員', directBuy, flag })
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
      res.render('privacy', { user, title: '更改密碼' })
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
