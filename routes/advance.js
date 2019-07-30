const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const passport = require('../config/passport')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 0) { return next() }
    return res.redirect('/')
  }
  res.redirect('/login')
}

router.get('/customers', (req, res) => {
  res.render('advance/customers')
})

router.get('/products', (req, res) => {
  res.render('advance/products')
})

router.get('/sales', (req, res) => {
  res.render('advance/sales')
})

// shop create
router.get('/shops/create', authenticatedAdmin, adminController.createShop)
router.post('/shops', authenticatedAdmin, upload.single('logo'), adminController.postShop)
// shop read
router.get('/shops', authenticatedAdmin, adminController.getShops)
router.get('/shops/:shop_id', authenticatedAdmin, adminController.getShop)
// shop update
router.get('/shops/:shop_id/edit', authenticatedAdmin, adminController.editShop)
router.put('/shops/:shop_id', authenticatedAdmin, upload.single('logo'), adminController.putShop)
// shop delete
router.delete('/shops/:shop_id', authenticatedAdmin, adminController.deleteShop)

// user create
router.get('/users/create', authenticatedAdmin, adminController.createUser)
router.post('/users', authenticatedAdmin, upload.single('avatar'), adminController.postUser)
// user read
router.get('/users', authenticatedAdmin, adminController.getUsers)
router.get('/users/:user_id', authenticatedAdmin, adminController.getUser)
// user update
router.get('/users/:user_id/edit', authenticatedAdmin, adminController.editUser)
router.put('/users/:user_id', authenticatedAdmin, upload.single('avatar'), adminController.putUser)
// user delete
router.delete('/users/:user_id', authenticatedAdmin, adminController.deleteUser)

module.exports = router
