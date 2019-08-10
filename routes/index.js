const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const customerController = require('../controllers/customerController')
const productController = require('../controllers/productController')
const tagController = require('../controllers/tagController')
const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

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

router.get('/inventory', authenticated, productController.getInventory)
router.post('/inventory', authenticated, productController.postInventory)

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

router.get(
  '/api/customers',
  authenticated,
  customerController.APIGetAllCustomers
)

router.get('/api/products', authenticated, productController.APIGetAllProducts)

module.exports = router
