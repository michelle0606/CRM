const express = require('express')
const router = express.Router()
const advanceController = require('../controllers/advanceController')
const db = require('../models')
const { User, Shop, Customer } = db
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers');

router.param('customers_id', async (req, res, next, id) => {
	const customer = await Customer.findByPk(Number(id))
	if ((!customer) || (!req.isAuthenticated()) || (req.user.ShopId !== customer.ShopId)) return res.redirect('/')
	next()
})

router.param('shop_id', async (req, res, next, id) => {
	const shop = await Shop.findByPk(Number(id))
	if ((!shop) || (!req.isAuthenticated()) || (req.user.ShopId !== Number(id))) return res.redirect('/')
	next()
})

router.param('user_id', async (req, res, next, id) => {
	const user = await User.findByPk(Number(id))
	if ((!user) || (!req.isAuthenticated()) || (req.user.ShopId !== user.ShopId)) return res.redirect('/')
	next()
})

router.param('salesperson_id', async (req, res, next, id) => {
	const user = await User.findByPk(Number(id))
	if ((!user) || (!req.isAuthenticated()) || (req.user.ShopId !== user.ShopId)) return res.redirect('/')
	next()
})

router.get('/customers', helpers.permit('mgr'), advanceController.getAllCustomers)
router.get('/customers/:customers_id', helpers.permit('mgr'), advanceController.getCustomer)


router.get('/products', advanceController.getAllProducts)
router.get('/users', advanceController.getAllSales)


// shop read
router.get('/shops/:shop_id', helpers.permit('mgr'), advanceController.getShop)
// shop update
router.get('/shops/:shop_id/edit', helpers.permit('mgr'), advanceController.editShop)
router.put('/shops/:shop_id', helpers.permit('mgr'), upload.single('logo'), advanceController.putShop)

// user create
router.get('/salespersons/create', helpers.permit('mgr'), advanceController.createSalesperson)
router.post('/salespersons', helpers.permit('mgr'), upload.single('avatar'), advanceController.postSalesperson)

// user read
router.get('/users/:user_id', helpers.permit('mgr'), advanceController.getUser)

// user update
router.get('/users/:user_id/edit', helpers.permit('mgr'), advanceController.editUser)
router.put('/users/:user_id', helpers.permit('mgr'), upload.single('avatar'), advanceController.putUser)

// user delete
router.delete('/salespersons/:salesperson_id', helpers.permit('mgr'), advanceController.deleteUser)

module.exports = router
