const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const customerController = require('../controllers/customerController')
const productController = require('../controllers/productController')
const tagController = require('../controllers/tagController')
const marketingController = require('../controllers/marketingController')
const tradeController = require('../controllers/tradeController')
const passport = require('../config/passport')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers')
const fileUpload = require('express-fileupload')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/login')
}

// user login system
router.get('/', authenticated, customerController.getHomePage)
router.get('/login', userController.signInPage)
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  userController.signIn
)

router.get('/forgot', userController.forgotPage)
router.post('/forgot', userController.getNewPassword)

router.get('/privacy/:id', authenticated, userController.privacyInfoPage)
router.put('/privacy/:id/edit', authenticated, userController.editPrivacyInfo)

router.get('/logout', userController.logout)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// inventory
router.get('/inventory', authenticated, productController.getInventory)

router.post(
  '/inventory',
  authenticated,
  fileUpload(),
  productController.postInventory
)

router.get(
  '/purchaseRecord',
  authenticated,
  productController.getPurchaseRecords
)

// marketing
router.get('/marketing', authenticated, marketingController.getMarketingPage)
router.post('/marketing', authenticated, marketingController.sendEmail)
router.put(
  '/marketing/template',
  authenticated,
  upload.single('info'),
  marketingController.updateTemplate
)

// customerDetail
router.post(
  '/customerDetail/:customers_id',
  authenticated,
  tagController.postTag
)
router.delete(
  '/customerDetail/:customers_id',
  authenticated,
  tagController.deleteTag
)

// api routes
router.get(
  '/api/customers',
  authenticated,
  customerController.APIGetAllCustomers
)

router.get('/api/products', authenticated, productController.APIGetAllProducts)

// dashboard
router.get('/dashboard', tradeController.getDashboard)
router.get('/dashboard/:nameOfTheStats', tradeController.getStats)
router.get(
  '/api/customer/:customers_id',
  authenticated,
  customerController.APIGetCustomerInfo
)

router.get(
  '/api/template',
  authenticated,
  marketingController.APIGetAllMailTemplate
)

module.exports = router
