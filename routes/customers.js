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

//  顧客客人頁面
router.get('/:customers_id', authenticated, customerController.getCustomer)

router.get(
  '/:customers_id/edit',
  authenticated,
  customerController.editCustomerPage
)
router.put(
  '/:customers_id/edit',
  authenticated,
  upload.single('avatar'),
  customerController.putCustomer
)

// 結帳頁面
router.get(
  '/:customers_id/records',
  authenticated,
  customerController.getRecords
)

// 顧客消費記錄
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

module.exports = router
