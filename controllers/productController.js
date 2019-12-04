const db = require('../models')
const Product = db.Product
const User = db.User
const PurchaseRecord = db.PurchaseRecord
const PurchaseRecordDetail = db.PurchaseRecordDetail
const ExpirationDate = db.ExpirationDate
const ProductExpDateDetail = db.ProductExpDateDetail
const csv = require('csvtojson')
const qrcode = require('qrcode')

const productController = {
  getInventory: async (req, res) => {
    const IDTag = await qrcode.toDataURL('17 2020-03-09')

    Product.findAll({ where: { ShopId: req.user.ShopId } }).then(products => {
      res.render('inventory', { title: '庫存管理', products, IDTag })
    })
  },

  // via csv
  postInventory: async (req, res) => {
    const regex = /\.(csv)$/i
    if (!req.file) {
      req.flash('top_messages', '請選擇檔案！')
      return res.redirect('/inventory')
    } else if (!regex.test(req.file.originalname)) {
      req.flash('top_messages', '檔案格式只接受CSV！')
      return res.redirect('/inventory')
    } else {
      // 到指定資料夾讀取csv檔，轉換成json格式
      const jsonArrayObj = await csv().fromFile(req.file.path)

      // 把json格式的進貨資料，儲存到資料庫
      const record = await PurchaseRecord.create({
        UserId: req.user.id,
        ShopId: req.user.ShopId
      })

      jsonArrayObj.forEach(async el => {
        const data = await PurchaseRecordDetail.create({
          quantity: el.quantity,
          ProductId: Number(el.ProductId),
          PurchaseRecordId: record.id
        })

        const existProduct = await Product.findOne({
          where: { id: Number(data.ProductId), ShopId: req.user.ShopId }
        })
        if (existProduct) {
          // 現有產品更新資訊
          const newInventory =
            Number(existProduct.inventory) + Number(data.quantity)
          existProduct.update({
            name: el.name,
            salePrice: el.salePrice,
            inventory: newInventory
          })
        } else {
          // 新產品
          Product.create({
            name: el.name,
            salePrice: el.salePrice,
            ShopId: req.user.ShopId,
            inventory: el.quantity
          })
        }
      })
      req.flash('top_messages', '成功上傳檔案！')
      return res.redirect('/inventory')
    }
  },

  // check details
  getPurchaseRecords: (req, res) => {
    PurchaseRecord.findAll({
      where: { ShopId: req.user.ShopId },
      include: [User, { model: Product, as: 'associatedProducts' }]
    }).then(purchaseRecords => {
      res.render('purchaseRecord', { purchaseRecords, title: '進貨紀錄' })
    })
  },

  // render drag page
  purchase: (req, res) => {
    Product.findAll({ where: { ShopId: req.user.ShopId } }).then(products => {
      res.render('purchase', { products, title: '單次進貨' })
    })
  },

  // post inventory via frontend
  postPurchase: async (req, res) => {
    const list = req.body.purchaseList
    const record = await PurchaseRecord.create({
      UserId: req.user.id,
      ShopId: req.user.ShopId
    })
    for (el of list) {
      const expDate = await ExpirationDate.findOne({
        where: { expDate: el.expirationDate, ShopId: req.user.ShopId }
      })
      if (expDate) {
        await ProductExpDateDetail.create({
          ProductId: el.ProductId,
          ExpirationDateId: expDate.id
        })
      } else {
        const expDate2 = await ExpirationDate.create({
          expDate: el.expirationDate,
          ShopId: req.user.ShopId
        })
        await ProductExpDateDetail.create({
          ProductId: el.ProductId,
          ExpirationDateId: expDate2.id
        })
      }

      const data = await PurchaseRecordDetail.create({
        quantity: el.quantity,
        ProductId: Number(el.ProductId),
        PurchaseRecordId: record.id
      })

      const existProduct = await Product.findOne({
        where: { id: Number(data.ProductId), ShopId: req.user.ShopId }
      })

      if (existProduct) {
        const newInventory =
          Number(existProduct.inventory) + Number(data.quantity)
        existProduct.update({
          name: el.name,
          salePrice: el.salePrice,
          inventory: newInventory
        })
      }
    }
    return res.redirect('/getqrcode')
  },

  // render qrcode in other page
  renderQrcode: async (req, res) => {
    const lastRecord = await PurchaseRecord.findAll({
      limit: 1,
      where: {
        ShopId: req.user.ShopId
      },
      order: [['createdAt', 'DESC']]
    })
    const list = await PurchaseRecordDetail.findAll({
      where: {
        PurchaseRecordId: lastRecord[0].id
      }
    })
    const qrcodeList = []
    for (record of list) {
      const IDTag = await qrcode.toDataURL(
        `${record.ProductId} PD:${getYearMonthDay(record.createdAt)} ED:`
      )
      qrcodeList.push({ qrcode: IDTag })
    }
    console.log(qrcodeList)

    res.render('qrcode', { qrcodeList })
  },

  APIGetAllProducts: (req, res) => {
    Product.findAll({ where: { ShopId: req.user.ShopId } }).then(products => {
      res.send(products)
    })
  }
}

function getYearMonthDay(dateObj) {
  let month = dateObj.getUTCMonth() + 1
  let day = dateObj.getUTCDate()
  let year = dateObj.getUTCFullYear()

  return (newdate = year + '/' + month + '/' + day)
}

module.exports = productController
