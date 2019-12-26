const db = require('../models')
const moment = require('moment')
const helpers = require('../_helpers')
// var momentTZ = require('moment-timezone')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Json2csvParser = require("json2csv").Parser
// const fs = require("fs")
const fs = require('fs').promises
const { Customer, Product, Sale, SaleDetail, Tag, CustomerDetail, ExpirationDate, ProductExpDateDetail, Return, ReturnDetail } = db

const tradeController = {
  getReturnsPage: async (req, res) => {
    res.render('trade', { 
      shopId: req.params.shop_id, 
      title: '退貨', 
      isReturnsPage: true
    })
  },

  postReturnsRecord: async (req, res) => {
    const itemIds = []
    const itemCounts = []
    const expDatesPerItem = []
    const stockDatesPerItem = []

    console.log(req.body)

    if (!req.body.productId) {
      req.flash('top_messages', '請掃描要退貨的商品！')
      return res.redirect(`/shops/${req.params.shop_id}/returns`)
    }

    // future word: refactor
    if (!Array.isArray(req.body.count)) itemCounts.push(req.body.count)
    else itemCounts.push(...req.body.count)

    if (!Array.isArray(req.body.productId)) itemIds.push(req.body.productId)
    else itemIds.push(...req.body.productId)

    if (!Array.isArray(req.body.expDates)) expDatesPerItem.push(req.body.expDates)
    else expDatesPerItem.push(...req.body.expDates)

    if (!Array.isArray(req.body.stockDates)) stockDatesPerItem.push(req.body.stockDates)
    else stockDatesPerItem.push(...req.body.stockDates)

    const rtn = await Return.create({
      UserId: Number(req.user.id),
      ShopId: Number(req.user.ShopId)
    })
    let i = 0
    let stockDatesStr = ''

    for (itemId of itemIds) {
      // calulate the holding time for the item
      stockDates = stockDatesPerItem[i].split(' ')
      for (stockDate of stockDates) {
        stockDatesStr += (' ' + moment().diff(moment(stockDate), 'hours').toString())
      }

      const returnDetail = await ReturnDetail.create({
        quantity: Number(itemCounts[i]),
        holdingTime: stockDatesStr,
        ProductId: Number(itemId),
        ReturnId: rtn.id
      })
      const product = await Product.findByPk(returnDetail.ProductId)

      await product.update({
        inventory: Number(product.inventory) - Number(returnDetail.quantity)
      })

      const expDates = expDatesPerItem[i++].split(' ')

      // update rows in tables, ProductExpDateDetails and ExpirationDates if needed
      for (expDate of expDates) {
        const expirationDate = ExpirationDate.findOne({
          where: {
            expDate: expDate,
            ShopId: Number(req.user.ShopId)
          }
        })
        const productExpDateDetail = ProductExpDateDetail.findOne({
          where: {
            ProductId: Number(itemId),
            ExpirationDateId: expirationDate.id
          }
        })
        const qty = productExpDateDetail.quantity - 1
        // expiration dates from the other shop?
        const c = await ProductExpDateDetail.count({ 
          where: { 
            ExpirationDateId: expirationDate.id
          } 
        })

        // if there is only one item that uses the expiration date
        // delete the related rows in both tables, ProductExpDateDetails and ExpirationDates
        if (c === 1) {
          if (qty !== 0) {
            await productExpDateDetail.update({
              quantity: productExpDateDetail.quantity - 1
            })
          } else {
            await ProductExpDateDetail.destroy({ 
              where: { 
                id:  productExpDateDetail.id
              } 
            })
            await ExpirationDate.destroy({ 
              where: { 
                id: expirationDate.id 
              } 
            })
          }
        }
      }
    }

    return res.redirect(`/shops/${req.params.shop_id}/returns`)
  },

  getCustomerTradePage: (req, res) => {
    Customer.findOne({ where: { id: req.params.customers_id } }).then(
      customer => {
        res.render('trade', { customer, title: '新增交易', isReturnsPage: false })
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
    const expDatesPerItem = []
    const stockDatesPerItem = []

    // console.log(req.body)

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

    if (!Array.isArray(req.body.expDates)) {
      expDatesPerItem.push(req.body.expDates)
    } else {
      expDatesPerItem.push(...req.body.expDates)
    }

    if (!Array.isArray(req.body.stockDates)) {
      stockDatesPerItem.push(req.body.stockDates)
    } else {
      stockDatesPerItem.push(...req.body.stockDates)
    }

    for (element of allProducts) {
      const product = await Product.findByPk(Number(element))
      const tag = await Tag.findOne({
        where: {
          tag: product.category,
          ShopId: req.user.ShopId
        }
      })
      if (tag) {
        const customerDetail = await CustomerDetail.findOne({
          where: {
            CustomerId: req.params.customers_id,
            TagId: tag.id
          }
        })
        if (!customerDetail) {
          await CustomerDetail.create({
            CustomerId: req.params.customers_id,
            TagId: tag.id
          })
        }
      } else {
        const tag2 = await Tag.create({
          tag: product.category,
          ShopId: req.user.ShopId
        })
        await CustomerDetail.create({
          CustomerId: req.params.customers_id,
          TagId: tag2.id
        })
      }
    }

    Sale.create({
      total: totalPrice,
      CustomerId: Number(req.params.customers_id),
      UserId: Number(req.user.id),
      ShopId: Number(req.user.ShopId)
    })
    .then(sale => {
      let i = 0
      let stockDatesStr = ''

      allProducts.forEach(itemId => {
        stockDates = stockDatesPerItem[i].split(' ')
        for (stockDate of stockDates) {
          stockDatesStr += (' ' + moment().diff(moment(stockDate), 'hours').toString())
        }

        SaleDetail.create({
          quantity: Number(allCounts[i]),
          ProductId: Number(itemId),
          SaleId: sale.id,
          holdingTime: stockDatesStr
        })
        .then(data => {
          Product.findByPk(data.ProductId)
          .then(product => {
            product.update({
              inventory: Number(product.inventory) - Number(data.quantity)
            })
          })
        })
        .then(() => {
          const expDates = expDatesPerItem[i++].split(' ')

          for (expDate of expDates) {
            ExpirationDate.findOne({
              where: {
                expDate: expDate,
                ShopId: Number(req.user.ShopId)
              }
            })
            .then(expirationDate => {
              ProductExpDateDetail.findOne({
                where: {
                  ProductId: Number(itemId),
                  ExpirationDateId: expirationDate.id
                }
              })
              .then(async productExpDateDetail => {
                const qty = productExpDateDetail.quantity - 1
                const c = await ProductExpDateDetail.count({ 
                  where: { 
                    ExpirationDateId: expirationDate.id
                  } 
                })

                if (c === 1) {
                  if (qty !== 0) {
                    productExpDateDetail.update({
                      quantity: productExpDateDetail.quantity - 1
                    })
                  } else {
                    ProductExpDateDetail.destroy({ 
                      where: { 
                        id:  productExpDateDetail.id
                      } 
                    })
                    ExpirationDate.destroy({ 
                      where: { 
                        id: expirationDate.id 
                      } 
                    })
                  }
                }
              })
            })
          }
        })
      })
    })
    .then(() => {
      Product.findAll({ 
        where: { 
          ShopId: req.user.ShopId 
        } 
      })
      .then(products => {
        const alertItem = products.filter(product => product.inventory < product.minimumStock)
        if (alertItem.length > 0) {
          req.flash('top_messages', '商品庫存過低！')
          return res.redirect(`/customers/${req.params.customers_id}/records`)
        }
        return res.redirect(`/customers/${req.params.customers_id}/records`)
      })
    })
  },

  getRec: async (req, res) => {
    console.log('in getRec')
    const sales = await Sale.findAll({
      where: {
        // CustomerId: 25,
        [Op.or]: [{ 
          CustomerId: [17, 25] 
        }]
      },
      include: [{
        model: SaleDetail,
        attributes: [],
      }],
      attributes: [
        'CustomerId',
        'SaleDetails.ProductId',
        [db.sequelize.fn('SUM', db.sequelize.col('SaleDetails.quantity')), 'quantity']
      ],
      group: [
        'SaleDetails.ProductId', 
        'CustomerId'
      ],
      raw: true
    })

    console.log(sales)
    const jsonData = JSON.parse(JSON.stringify(sales))
    const json2csvParser = new Json2csvParser({ header: false })
    const csvDate = json2csvParser.parse(jsonData)

    await fs.writeFile('rec_test.csv', csvDate)

    // fs.writeFile("rec_test.csv", csvDate, (error) => {
    //   if (error) throw error
    //   console.log("Write to rec_test.csv successfully!")
    // })
    
    new Promise((resolve, reject) => {
      const { spawn } = require('child_process')
      const pyRec = spawn('python3', ['./recSys.py'])

      pyRec.stdout.on('data', (data) => {
        resolve(data)
      })
      pyRec.stderr.on('data', (data) => {
        reject(data)
      })
    })
    .then((recs) => {
      // console.log(recs.toString())
      res.end(recs.toString())
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

    if (req.params.nameOfTheStats.includes('dailyRevenue')) {
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
        if (typeof revenue === 'undefined') dailyRevenueLineChart.series[0].data.push(0)
        else dailyRevenueLineChart.series[0].data.push(parseInt(revenue.amount))
        startDate = moment(startDate)
          .add(1, 'days')
          .format('YYYY-MM-DD')
      }

      return res.json(dailyRevenueLineChart)
    } else if (req.params.nameOfTheStats.includes('bestSellers')) {
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
          }, {
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
          [db.sequelize.fn('SUM', db.sequelize.col('SaleDetails.quantity')), 'quantity']
        ],
        group: 'associatedProducts.id',
        order: [[db.sequelize.fn('SUM', db.sequelize.col('SaleDetails.quantity')), 'DESC']],
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
    } else if (req.params.nameOfTheStats.includes('mostMentioned')) {
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
          [db.sequelize.fn('COUNT', db.sequelize.col('Sale.id')), 'numOfSalesRec']
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
    } else if (req.params.nameOfTheStats.includes('daysToExp')) {
      const expDates = await ExpirationDate.findAll({
        where: {
          ShopId: Number(req.params.shop_id)
        },
        include: [{
          model: ProductExpDateDetail
        }, {
          model: Product,
          as: 'associatedProducts',
          where: {
            id: {
              [Op.eq]: db.sequelize.col('ProductExpDateDetails.ProductId')
            }
          }
        }],
        attributes: [
          'expDate',
          'associatedProducts.id',
          'associatedProducts.name',
          'ProductExpDateDetails.quantity'
        ],
        includeIgnoreAttributes: false,
        raw: true
      })

      const series = [{
        name: '270天',
        data: [],
        color: '#0000FF'
      }, {
        name: '225天',
        data: [],
        color: '#00FF00'
      }, {
        name: '195天',
        data: [],
        color: '#FFFF00'
      }, {
        name: '180天',
        data: [],
        color: '#FF7F00'
      }, {
        name: '180以下',
        data: [],
        color: '#FF0000'
      }]

      for (el of expDates) {
        const daysToExp = moment(el.expDate).diff(moment(), 'days')
        const item = {
          name: el.name,
          value: daysToExp
        }

        switch(true) {
          case (daysToExp > 270):
            for (let i = 0; i < el.quantity; i++) series[0].data.push(item)
            break
          case (daysToExp > 225):
            for (let i = 0; i < el.quantity; i++) series[1].data.push(item)
            break
          case (daysToExp > 195):
            for (let i = 0; i < el.quantity; i++) series[2].data.push(item)
            break
          case (daysToExp > 180):
            for (let i = 0; i < el.quantity; i++) series[3].data.push(item)
            break
          default:
            for (let i = 0; i < el.quantity; i++) series[4].data.push(item)
        }
      }

      return res.json(series)
    } else if (req.params.nameOfTheStats.includes('HoldingTime')) {
      const holdingTimeDumbbell = {
        title: {
          text: ''
        },
        series: [{
          name: '',
          data: []
        }, {
          type: 'scatter',
          name: 'whatever',
          data: []
        }]
      }

      const holdingTimePerItem = await Sale.findAll({
        where: {
          createdAt: {
            [Op.gte]: moment(req.query.start).startOf('day'),
            [Op.lte]: moment(req.query.end).endOf('day')
          },
          ShopId: Number(req.params.shop_id)
        },
        include: [
          {
            model: SaleDetail,
          }, {
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
          'SaleDetails.ProductId',
          'associatedProducts.name',
          [db.sequelize.fn('SUM', db.sequelize.col('SaleDetails.quantity')), 'quantity'],
          [db.sequelize.fn('GROUP_CONCAT', db.sequelize.col('SaleDetails.holdingTime')), 'holdingTime']
        ],
        group: [
          db.sequelize.col('SaleDetails.ProductId'), 
          'associatedProducts.name'
        ],
        order: db.sequelize.col('SaleDetails.ProductId'),
        // limit: 15,
        includeIgnoreAttributes: false,
        raw: true
      })

      switch (req.params.nameOfTheStats) {
        case 'HoldingTimeToday':
          holdingTimeDumbbell.title.text = '今日商品架上停留時間'
          break
        case 'HoldingTimeYesterday':
          holdingTimeDumbbell.title.text = '昨日商品架上停留時間'
          break
        case 'HoldingTimeLastSevenDays':
          holdingTimeDumbbell.title.text = '過去7日商品架上停留時間'
          break
        case 'HoldingTimeLastThirtyDays':
          holdingTimeDumbbell.title.text = '過去30日商品架上停留時間'
          break
        case 'HoldingTimeThisMonth':
          holdingTimeDumbbell.title.text = '本月商品架上停留時間'
          break
        case 'HoldingTimeLastMonth':
          holdingTimeDumbbell.title.text = '上個月商品架上停留時間'
          break
        default:
          holdingTimeDumbbell.title.text = '自訂區間商品架上停留時間'
      }

      for (el of holdingTimePerItem) {
        let tmp = {}
        let sum = 0

        // remove whitespace from both sides of the string
        // and obtain an array by spliting the string using whitespace or comma
        // and convert each of the array elements from string into number
        let holdingTimeArr = el.holdingTime.trim().split(/[ ,]+/).map(e => Number(e))
        holdingTimeArr.sort((a, b) => {return a - b})

        // console.log(holdingTimeArr)

        const min = holdingTimeArr[0]
        const max = holdingTimeArr[holdingTimeArr.length - 1]

        for (let i = 0; i < holdingTimeArr.length; i++) sum += holdingTimeArr[i]
        let avgHoldingTime = sum / holdingTimeArr.length

        tmp.name = el.name
        tmp.low = min
        tmp.high = max
        // console.log(tmp)
        holdingTimeDumbbell.series[0].data.push(tmp)
        holdingTimeDumbbell.series[1].data.push(avgHoldingTime)
      }

      return res.json(holdingTimeDumbbell)
    }
  }
}

module.exports = tradeController
