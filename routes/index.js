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
router.get('/', (req, res) => {
  const shop_id = req.user.ShopId
  res.redirect(`/shop/${shop_id}`)
})

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

router.get('/shop/:shop_id', (req, res) => {
  res.render('index', { title: 'Waromen' })
})

router.get(
  '/shop/:shop_id/members',
  authenticated,
  customerController.getAllCustomers
)

module.exports = router
