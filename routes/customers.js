const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customerController')
const tradeControlloer = require('../controllers/tradeController')
const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

router.get('/', authenticated, customerController.getAllCustomers)
router.post('/', authenticated, customerController.addCustomer)

router.get('/:customers_id', authenticated, customerController.getCustomer)
router.get('/:customers_id/record', tradeControlloer.getCustomerTradePage)
router.post('/:customers_id/record', tradeControlloer.createNewTradeRecord)

module.exports = router
