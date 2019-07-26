const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Waromen' })
})

router.get('/login', (req, res) => {
  res.render('login', { title: '登入' })
})

router.get('/signup', (req, res) => {
  res.render('signup', { title: '開啟服務' })
})

router.get('/shop/:shop_id', (req, res) => {
  res.render('index', { title: 'Waromen' })
})

router.get('/shop/:shop_id/members', (req, res) => {
  res.render('allMembers', { title: '所有會員' })
})

module.exports = router
