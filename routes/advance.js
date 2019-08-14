const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const advanceController = require('../controllers/advanceController')
const passport = require('../config/passport')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 0 || req.user.role === 1) { return next() }
    return res.redirect('/')
  }
  res.redirect('/login')
}

router.get('/customers', authenticatedAdmin, advanceController.getAllCustomers)
router.get('/customers/:customers_id', authenticatedAdmin, advanceController.getCustomer)


router.get('/products', advanceController.getAllProducts)
router.get('/users', advanceController.getAllSales)


// shop read
router.get('/shops/:shop_id', authenticatedAdmin, advanceController.getShop)
// shop update
router.get('/shops/:shop_id/edit', authenticatedAdmin, advanceController.editShop)
router.put('/shops/:shop_id', authenticatedAdmin, upload.single('logo'), advanceController.putShop)

// user create
router.get('/salespersons/create', authenticatedAdmin, advanceController.createSalesperson)
router.post('/salespersons', authenticatedAdmin, upload.single('avatar'), advanceController.postSalesperson)

// user read
router.get('/users/:user_id', authenticatedAdmin, advanceController.getUser)

// user update
router.get('/users/:user_id/edit', authenticatedAdmin, advanceController.editUser)
router.put('/users/:user_id', authenticatedAdmin, upload.single('avatar'), advanceController.putUser)

// user delete
router.delete('/salespersons/:salesperson_id', advanceController.deleteUser)

module.exports = router
