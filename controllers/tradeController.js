const db = require('../models')
const Shop = db.Shop
const Customer = db.Customer
const Product = db.Product
const Sale = db.Sale
const SaleDetail = db.SaleDetail

const tradeController = {
  getCustomerTradePage: (req, res) => {
    Customer.findOne({ where: { id: req.params.customers_id } }).then(
      customer => {
        res.render('trade', { customer, title: '新增交易' })
      }
    )
  },

  createNewTradeRecord: async (req, res) => {
    const totalPrice = req.body.total
    const allProducts = req.body.productId
    const allCounts = req.body.count

    const sale = await Sale.create({
      date: new Date(),
      total: totalPrice,
      CustomerId: req.params.customers_id,
      UserId: req.user.id,
      ShopId: req.user.ShopId
    })

    if (allCounts.length > 1) {
      let connect = 0
      allProducts.forEach(product => {
        SaleDetail.create({
          quantity: allCounts[connect],
          ProductId: product,
          SaleId: sale.id
        })
        connect += 1
      })
    } else {
      SaleDetail.create({
        quantity: allCounts,
        ProductId: allProducts,
        SaleId: sale.id
      })
    }

    return res.redirect(`/customers/${req.params.customers_id}`)
  },

  APIGetAllProducts: (req, res) => {
    Product.findAll().then(products => {
      res.send(products)
    })
  }
}

module.exports = tradeController
