const db = require('../models')
const Product = db.Product
const User = db.User
const PurchaseRecord = db.PurchaseRecord
const PurchaseRecordDetail = db.PurchaseRecordDetail
const csv = require('csvtojson')

const productController = {
  getInventory: (req, res) => {
    Product.findAll({ where: { ShopId: req.user.ShopId } }).then(products => {
      res.render('inventory', { title: '庫存管理', products })
    })
  },

  postInventory: async (req, res) => {
    let productsFile = req.files.products
    let uploadPath = '../uploadCsv' + productsFile.name

    // 先把上傳的csv檔案存到指定資料夾
    productsFile.mv(uploadPath, function(err) {
      if (err) {
        return res.status(500).send(err)
      }
    })

    // 到指定資料夾讀取csv檔，轉換成json格式
    const jsonArrayObj = await csv().fromFile(uploadPath)

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

      const existProduct = await Product.findByPk(data.ProductId, {
        where: { ShopId: req.user.ShopId }
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
          id: el.ProductId,
          name: el.name,
          salePrice: el.salePrice,
          ShopId: req.user.ShopId,
          inventory: el.quantity
        })
      }
    })

    res.redirect('/inventory')
  },

  getPurchaseRecords: (req, res) => {
    PurchaseRecord.findAll({
      where: { ShopId: req.user.ShopId },
      include: [User, { model: Product, as: 'associatedProducts' }]
    }).then(purchaseRecords => {
      res.render('purchaseRecord', { purchaseRecords, title: '進貨紀錄' })
    })
  },

  APIGetAllProducts: (req, res) => {
    Product.findAll({ where: { ShopId: req.user.ShopId } }).then(products => {
      res.send(products)
    })
  }
}

module.exports = productController
