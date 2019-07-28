const express = require('express')
const router = express.Router()
// const userController = require('../controllers/userController')
const customerController = require('../controllers/customerController')
const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

router.get('/', authenticated, customerController.getAllCustomers)
router.post('/', authenticated, customerController.addCustomer)
router.get(
  '/:customers_id',
  authenticated,
  customerController.getCustomer
)

module.exports = router
