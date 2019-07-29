const express = require('express')
const router = express.Router()

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

router.get('/customers', (req, res) => {
  res.render('advance/customers')
})

router.get('/products', (req, res) => {
  res.render('advance/products')
})

router.get('/sales', (req, res) => {
  res.render('advance/sales')
})

module.exports = router
