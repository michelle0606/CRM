const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const customerController = require('../controllers/customerController')
const productController = require('../controllers/productController')
const tagController = require('../controllers/tagController')
const marketingController = require('../controllers/marketingController')
const tradeController = require('../controllers/tradeController')
const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

// user login system
router.get('/', authenticated, (req, res) => res.redirect('/customers/create'))
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
router.post('/inventory', authenticated, productController.postInventory)

// marketing
router.get('/marketing', authenticated, marketingController.getMarketingPage)
router.post('/marketing', authenticated, marketingController.sendEmail)

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

module.exports = router
