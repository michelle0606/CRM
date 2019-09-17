const db = require('../models')
const { Customer, Product, Sale, SaleDetail, Tag, CustomerDetail } = db

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
    const allProducts = []
    const allCounts = req.body.count

    if (typeof req.body.productId !== Array) {
      allProducts.push(req.body.productId)
    } else {
      allProducts.push(...req.body.productId)
    }

    allProducts.forEach(id => {
      Product.findByPk(Number(id)).then(product => {
        Tag.create({
          tag: product.category,
          ShopId: req.user.ShopId,
        }).then(tag => {
          CustomerDetail.create({
            CustomerId: req.params.customers_id,
            TagId: tag.id
          })
        })
      })
    })

    Sale.create({
      total: totalPrice,
      CustomerId: req.params.customers_id,
      UserId: req.user.id,
      ShopId: req.user.ShopId
    })
      .then(sale => {
        let connect = 0
        allProducts.forEach(product => {
          SaleDetail.create({
            quantity: Number(allCounts[connect]),
            ProductId: Number(product),
            SaleId: sale.id
          }).then(data => {
            Product.findByPk(data.ProductId).then(product => {
              const newInventory =
                Number(product.inventory) - Number(data.quantity)
              product.update({
                inventory: newInventory
              })
            })
          })
          connect += 1
        })
      })
      .then(() => {
        Product.findAll({ where: { ShopId: req.user.ShopId } }).then(
          products => {
            const alertItem = products.filter(
              product => product.inventory < product.minimumStock
            )
            if (alertItem.length > 0) {
              req.flash('top_messages', '商品庫存過低！')
              return res.redirect(
                `/customers/${req.params.customers_id}/records`
              )
            }
            return res.redirect(`/customers/${req.params.customers_id}/records`)
          }
        )
      })
  }
}

module.exports = tradeController
