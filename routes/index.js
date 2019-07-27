const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const customerController = require('../controllers/customerController')
const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

/* GET home page. */
router.get('/', authenticated, customerController.searchCustomer)

router.get('/login', userController.signInPage)
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  userController.signIn
)
router.get('/logout', userController.logout)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/', authenticated, customerController.searchCustomer)

router.get('/customers', authenticated, customerController.getAllCustomers)
router.post('/customers', authenticated, customerController.addCustomer)
router.get(
  '/customers/:customers_id',
  authenticated,
  customerController.getCustomer
)

router.get(
  '/api/customers',
  authenticated,
  customerController.APIGetAllCustomers
)

module.exports = router
