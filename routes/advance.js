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

// create
router.get('/shops/create', authenticatedAdmin, adminController.createShop)
router.post('/shops', authenticatedAdmin, upload.single('logo'), adminController.postShop)
// read
router.get('/shops', authenticatedAdmin, adminController.getShops)
router.get('/shops/:id', authenticatedAdmin, adminController.getShop)
// update
router.get('/shops/:id/edit', authenticatedAdmin, adminController.editShop)
router.put('/shops/:id', authenticatedAdmin, upload.single('logo'), adminController.putShop)
// delete
router.delete('/shops/:id', authenticatedAdmin, adminController.deleteShop)

module.exports = router
