const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Waromen' })
})

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' })
})

router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Open Service' })
})
module.exports = router
