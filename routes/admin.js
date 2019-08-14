const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// shop create
router.get('/shops/create', adminController.createShop)
router.post('/shops', upload.single('logo'), adminController.postShop)
// shop read
router.get('/shops', adminController.getShops)
router.get('/shops/:shop_id', adminController.getShop)
// shop update
router.get('/shops/:shop_id/edit', adminController.editShop)
router.put('/shops/:shop_id', upload.single('logo'), adminController.putShop)
// shop delete
router.delete('/shops/:shop_id', adminController.deleteShop)

// user create
router.get('/users/create', adminController.createUser)
router.post('/users', upload.single('avatar'), adminController.postUser)
// user read
router.get('/users', adminController.getUsers)
router.get('/users/:user_id', adminController.getUser)
// user update
router.get('/users/:user_id/edit', adminController.editUser)
router.put('/users/:user_id', upload.single('avatar'), adminController.putUser)
// user delete
router.delete('/users/:user_id', adminController.deleteUser)

module.exports = router
