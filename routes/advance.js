const express = require('express')
const router = express.Router()

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