const express = require('express')
const router = express.Router()

router.get('/customers', (req, res) => {
  res.render('admin/customers')
})

module.exports = router