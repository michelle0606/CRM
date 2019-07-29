const db = require('../models')
const Shop = db.Shop
const Customer = db.Customer
const Product = db.Product
const Sale = db.Sale
const SaleDetail = db.SaleDetail

const tradeController = {
  getCustomerTradePage: (req, res) => {
    Customer.findOne({ where: { id: req.params.customers_id } }).then(customer => {
      res.render('trade', { customer })
    })
  },

  createNewTradeRecord: async (req, res) => {
    const totalPrice = Number(req.body.total)
    const allProducts = req.body.productId
    const allCounts = req.body.count

    const sale = await Sale.create({
      date: new Date(),
      total: totalPrice,
      CustomerId: Number(req.params.customers_id),
      UserId: 6 || Number(req.user.id),
      ShopId: 2,
    })

    let connect = 0
    allProducts.forEach(p => {
      SaleDetail.create({
        quantity: allCounts[connect],
        ProductId: Number(p),
        SaleId: sale.id
      })
      connect += 1
    })

    return res.send('good')
  },


  APIGetAllProducts: (req, res) => {
    Product.findAll().then(products => {
      res.send(products)
    })
  }
}

module.exports = tradeController