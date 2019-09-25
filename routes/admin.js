const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const db = require('../models')
const { User, Shop } = db
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const accessController = require('../_accessController')

router.param('shop_id', async (req, res, next, id) => {
	const shop = await Shop.findByPk(Number(id))
	if (!shop) return res.redirect('/')
	next()
})

router.param('user_id', async (req, res, next, id) => {
	const user = await User.findByPk(Number(id))
	if (!user) return res.redirect('/')
	next()
})

// shop create
router.get('/shops/create', accessController.permit('admin'), adminController.createShop)
router.post('/shops', accessController.permit('admin'), upload.single('logo'), adminController.postShop)
// shop read
router.get('/shops', accessController.permit('admin'), adminController.getShops)
router.get('/shops/:shop_id', accessController.permit('admin'), adminController.getShop)
// shop update
router.get('/shops/:shop_id/edit', accessController.permit('admin'), adminController.editShop)
router.put('/shops/:shop_id', accessController.permit('admin'), upload.single('logo'), adminController.putShop)
// shop delete
router.delete('/shops/:shop_id', accessController.permit('admin'), adminController.deleteShop)

// user create
router.get('/users/create', accessController.permit('admin'), adminController.createUser)
router.post('/users', accessController.permit('admin'), upload.single('avatar'), adminController.postUser)
// user read
router.get('/users', accessController.permit('admin'), adminController.getUsers)
router.get('/users/:user_id', accessController.permit('admin'), adminController.getUser)
// user update
router.get('/users/:user_id/edit', accessController.permit('admin'), adminController.editUser)
router.put('/users/:user_id', accessController.permit('admin'), upload.single('avatar'), adminController.putUser)
// user delete
router.delete('/users/:user_id', accessController.permit('admin'), adminController.deleteUser)

module.exports = router
