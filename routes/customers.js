const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customerController')
const tradeControlloer = require('../controllers/tradeController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

router.get('/', authenticated, customerController.getAllCustomers)
router.get('/create', authenticated, customerController.createCustomerPage)
router.post('/create', authenticated, customerController.addCustomer)

router.get('/:customers_id', authenticated, customerController.getCustomer)
router.get(
  '/:customers_id/record',
  authenticated,
  tradeControlloer.getCustomerTradePage
)
router.post(
  '/:customers_id/record',
  authenticated,
  tradeControlloer.createNewTradeRecord
)

router.get('/:customers_id/edit', customerController.editCustomerPage)
router.put(
  '/:customers_id/edit',
  upload.single('avatar'),
  customerController.putCustomer
)
router.get('/:customers_id/records', customerController.getRecords)

module.exports = router
