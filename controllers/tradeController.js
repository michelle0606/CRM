const db = require('../models')
const moment = require('moment')
const helpers = require('../_helpers')
// var momentTZ = require('moment-timezone')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { Customer, Product, Sale, SaleDetail, Tag, CustomerDetail } = db

const tradeController = {
  getCustomerTradePage: (req, res) => {
    Customer.findOne({ where: { id: req.params.customers_id } }).then(
      customer => {
        res.render('trade', { customer, title: '新增交易' })
      }
    )
  },

  directBuy: (req, res) => {
    Customer.findOne({
      where: { name: '非會員交易紀錄', ShopId: Number(req.user.ShopId) }
    }).then(customer => {
      if (!customer) {
        res.redirect('/')
      } else {
        res.render('trade', { customer, title: '直接結帳' })
      }
    })
  },

  createNewTradeRecord: async (req, res) => {
    const totalPrice = req.body.total
    const allProducts = []
    const allCounts = []

    if (!req.body.productId) {
      req.flash('top_messages', '無品項不可以新增交易！')
      return res.redirect(`/customers/${req.params.customers_id}/record`)
    }

    if (!Array.isArray(req.body.count)) {
      allCounts.push(req.body.count)
    } else {
      allCounts.push(...req.body.count)
    }

    if (!Array.isArray(req.body.productId)) {
      allProducts.push(req.body.productId)
    } else {
      allProducts.push(...req.body.productId)
    }

    allProducts.forEach(id => {
      Product.findByPk(Number(id)).then(product => {
        Tag.findOne({
          where: {
            tag: product.category,
            ShopId: req.user.ShopId
          }
        }).then(tag => {
          if (tag) {
            CustomerDetail.findOne({
              where: {
                CustomerId: req.params.customers_id,
                TagId: tag.id
              }
            }).then(customerDetail => {
              if (!customerDetail) {
                CustomerDetail.create({
                  CustomerId: req.params.customers_id,
                  TagId: tag.id
                })
              }
            })
          } else {
            Tag.create({
              tag: product.category,
              ShopId: req.user.ShopId
            }).then(tag2 => {
              CustomerDetail.create({
                CustomerId: req.params.customers_id,
                TagId: tag2.id
              })
            })
          }
        })
      })
    })

    Sale.create({
      total: totalPrice,
      CustomerId: Number(req.params.customers_id),
      UserId: Number(req.user.id),
      ShopId: Number(req.user.ShopId)
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
          connect++
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
  },

  getDashboard: (req, res) => {
    return res.render('dashboard', {
      shopId: helpers.getUser(req).ShopId,
      title: '報表分析'
    })
  },

  getStats: async (req, res) => {
    // console.log(req.params.nameOfTheStats)
    // console.log(req.query.start)
    // console.log(req.query.end)
    // console.log(helpers.getUser(req).ShopId)//error

    const dailyRevenueLineChart = {
      title: {
        text: ''
      },
      plotOptions: {
        series: {
          pointStart: Date.UTC(2000, 0, 1)
        }
      },
      series: [
        {
          // name: '營業額',
          data: []
        }
      ]
    }
    const bestSellersColumnChart = {
      title: {
        text: ''
      },
      series: [
        {
          name: '',
          data: []
        }
      ]
    }
    const mostMentionedColumnChart = {
      title: {
        text: ''
      },
      series: [
        {
          name: '',
          data: []
        }
      ]
    }

    if (req.params.nameOfTheStats.includes('dailyRevenue')) {
      const dailyRevenue = await Sale.findAll({
        where: {
          createdAt: {
            [Op.gte]: moment(req.query.start).startOf('day'),
            [Op.lte]: moment(req.query.end).endOf('day')
          },
          ShopId: req.params.shop_id
        },
        attributes: [
          [db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'date'],
          [db.sequelize.fn('SUM', db.sequelize.col('total')), 'amount']
        ],
        group: [db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'date'],
        // limit: 15,
        raw: true
      })

      let startDate = moment(req.query.start).format('YYYY-MM-DD')
      const endDate = moment(req.query.end).format('YYYY-MM-DD')
      let revenue = ''
      const yyyy = parseInt(startDate.substring(0, 4))
      const mm = parseInt(startDate.substring(5, 7)) - 1 // zero-based
      const dd = parseInt(startDate.substring(8, 10))

      switch (req.params.nameOfTheStats) {
        case 'dailyRevenueToday':
          dailyRevenueLineChart.title.text = '今日營業額'
          break
        case 'dailyRevenueYesterday':
          dailyRevenueLineChart.title.text = '昨日營業額'
          break
        case 'dailyRevenueLastSevenDays':
          dailyRevenueLineChart.title.text = '過去7日營業額'
          break
        case 'dailyRevenueLastThirtyDays':
          dailyRevenueLineChart.title.text = '過去30日營業額'
          break
        case 'dailyRevenueThisMonth':
          dailyRevenueLineChart.title.text = '本月營業額'
          break
        case 'dailyRevenueLastMonth':
          dailyRevenueLineChart.title.text = '上個月營業額'
          break
        default:
          dailyRevenueLineChart.title.text = '自訂區間營業額'
      }
      dailyRevenueLineChart.plotOptions.series.pointStart = Date.UTC(
        yyyy,
        mm,
        dd
      )

      while (!moment(startDate).isAfter(endDate)) {
        revenue = dailyRevenue.find(record => record.date === startDate)
        if (typeof revenue === 'undefined')
          dailyRevenueLineChart.series[0].data.push(0)
        else dailyRevenueLineChart.series[0].data.push(parseInt(revenue.amount))
        startDate = moment(startDate)
          .add(1, 'days')
          .format('YYYY-MM-DD')
      }

      return res.json(dailyRevenueLineChart)
    } else if (req.params.nameOfTheStats.includes('bestSellers')) {
      const bestSellers = await Sale.findAll({
        where: {
          createdAt: {
            [Op.gte]: moment(req.query.start).startOf('day'),
            [Op.lte]: moment(req.query.end).endOf('day')
          },
          ShopId: req.params.shop_id
        },
        include: [
          {
            model: SaleDetail
          },
          {
            model: Product,
            as: 'associatedProducts',
            where: {
              id: {
                [Op.eq]: db.sequelize.col('SaleDetails.ProductId')
              }
            }
          }
        ],
        attributes: [
          'associatedProducts.id',
          'associatedProducts.name',
          [
            db.sequelize.fn('SUM', db.sequelize.col('SaleDetails.quantity')),
            'quantity'
          ]
        ],
        group: 'associatedProducts.id',
        order: [
          [
            db.sequelize.fn('SUM', db.sequelize.col('SaleDetails.quantity')),
            'DESC'
          ]
        ],
        // limit: 15,
        includeIgnoreAttributes: false,
        raw: true
      })

      switch (req.params.nameOfTheStats) {
        case 'bestSellersToday':
          bestSellersColumnChart.title.text = '今日熱銷'
          break
        case 'bestSellersYesterday':
          bestSellersColumnChart.title.text = '昨日熱銷'
          break
        case 'bestSellersLastSevenDays':
          bestSellersColumnChart.title.text = '過去7日熱銷'
          break
        case 'bestSellersLastThirtyDays':
          bestSellersColumnChart.title.text = '過去30日熱銷'
          break
        case 'bestSellersThisMonth':
          bestSellersColumnChart.title.text = '本月熱銷'
          break
        case 'bestSellersLastMonth':
          bestSellersColumnChart.title.text = '上個月熱銷'
          break
        default:
          bestSellersColumnChart.title.text = '自訂區間熱銷'
      }

      // top 15
      const count = bestSellers.length > 15 ? 15 : bestSellers.length

      for (let i = 0; i < count; i++) {
        let tmp = []
        tmp.push(bestSellers[i].name)
        tmp.push(parseInt(bestSellers[i].quantity))
        bestSellersColumnChart.series[0].data.push(tmp)
      }

      return res.json(bestSellersColumnChart)
    } else {
      const sales = await Sale.findAndCountAll({
        where: {
          createdAt: {
            [Op.gte]: moment(req.query.start).startOf('day'),
            [Op.lte]: moment(req.query.end).endOf('day')
          },
          ShopId: req.params.shop_id
        }
      })
      const mostMentioned = await Sale.findAll({
        where: {
          createdAt: {
            [Op.gte]: moment(req.query.start).startOf('day'),
            [Op.lte]: moment(req.query.end).endOf('day')
          },
          ShopId: req.params.shop_id
        },
        include: [
          {
            model: Product,
            as: 'associatedProducts'
          }
        ],
        attributes: [
          'associatedProducts.id',
          'associatedProducts.name',
          [
            db.sequelize.fn('COUNT', db.sequelize.col('Sale.id')),
            'numOfSalesRec'
          ]
        ],
        group: db.sequelize.col('associatedProducts.id'),
        order: [
          [db.sequelize.fn('COUNT', db.sequelize.col('Sale.id')), 'DESC']
        ],
        // limit: 15,
        includeIgnoreAttributes: false,
        raw: true
      })

      switch (req.params.nameOfTheStats) {
        case 'mostMentionedToday':
          mostMentionedColumnChart.title.text = '今日熱門討論商品'
          break
        case 'mostMentionedYesterday':
          mostMentionedColumnChart.title.text = '昨日熱門討論商品'
          break
        case 'mostMentionedLastSevenDays':
          mostMentionedColumnChart.title.text = '過去7日熱門討論商品'
          break
        case 'mostMentionedLastThirtyDays':
          mostMentionedColumnChart.title.text = '過去30日熱門討論商品'
          break
        case 'mostMentionedThisMonth':
          mostMentionedColumnChart.title.text = '本月熱門討論商品'
          break
        case 'mostMentionedLastMonth':
          mostMentionedColumnChart.title.text = '上個月熱門討論商品'
          break
        default:
          mostMentionedColumnChart.title.text = '自訂區間熱門討論商品'
      }

      // top 15
      const count = mostMentioned.length > 15 ? 15 : mostMentioned.length

      for (let i = 0; i < count; i++) {
        let tmp = []
        mostMentioned[i].numOfSalesRec /= sales.count / 100
        tmp.push(mostMentioned[i].name)
        tmp.push(mostMentioned[i].numOfSalesRec)
        mostMentionedColumnChart.series[0].data.push(tmp)
      }

      return res.json(mostMentionedColumnChart)
    }
  }
}

module.exports = tradeController
