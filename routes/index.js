const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const customerController = require('../controllers/customerController')
<<<<<<< HEAD

=======
const tradeController = require('../controllers/tradeController')
>>>>>>> origin/master
const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

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

<<<<<<< HEAD
=======
router.get('/', authenticated, customerController.searchCustomer)


>>>>>>> origin/master
router.get(
  '/api/customers',
  authenticated,
  customerController.APIGetAllCustomers
)

router.get('/api/products', tradeController.APIGetAllProducts)

module.exports = router
