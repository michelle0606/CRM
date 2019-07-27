const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const passport = require('../config/passport')

/* GET home page. */
router.get('/', (req, res) => {
	// console.log(req.user)
  res.render('index', { title: 'Waromen' })
})

router.get('/login', userController.signInPage)
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/shop/:shop_id', (req, res) => {
  res.render('index', { title: 'Waromen' })
})

router.get('/shop/:shop_id/members', (req, res) => {
  res.render('allMembers', { title: '所有會員' })
})

module.exports = router
