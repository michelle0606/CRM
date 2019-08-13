const db = require('../models')
const Product = db.Product
const PurchaseRecord = db.PurchaseRecord
const PurchaseRecordDetail = db.PurchaseRecordDetail
const csv = require('csvtojson')
const fs = require('fs')

const productController = {
  getInventory: (req, res) => {
    Product.findAll({ where: { ShopId: req.user.ShopId } }).then(products => {
      res.render('inventory', { title: '庫存管理', products })
    })
  },

  postInventory: async (req, res) => {
    let productsFile = req.files.products
    let uploadPath = '/Users/walle/CRM/uploadCsv/' + productsFile.name

    // 先把上傳的csv檔案存到指定資料夾
    productsFile.mv(uploadPath, function(err) {
      if (err) {
        return res.status(500).send(err)
      }
    })

    // 到指定資料夾讀取csv檔，轉換成json格式
    const jsonArrayObj = await csv().fromFile(uploadPath)

    // 把json格式個進貨資料，儲存到資料庫
    const record = await PurchaseRecord.create({
      UserId: req.user.id,
      ShopId: req.user.ShopId
    })

    jsonArrayObj.forEach(async el => {
      const data = await PurchaseRecordDetail.create({
        quantity: el.quantity,
        ProductId: Number(el.ProductId),
        RecordId: record.id
      })
      const product = await Product.findByPk(data.ProductId, {
        where: { ShopId: req.user.ShopId }
      })
      // 更新產品資訊
      const newInventory = Number(product.inventory) + Number(data.quantity)
      product.update({
        name: el.name,
        salePrice: el.salePrice,
        inventory: newInventory
      })
    })

    res.redirect('/inventory')
  },

  APIGetAllProducts: (req, res) => {
    Product.findAll({ where: { ShopId: req.user.ShopId } }).then(products => {
      res.send(products)
    })
  }
}

module.exports = productController