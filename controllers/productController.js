const db = require('../models')
const Product = db.Product
const csv = require('csvtojson')
const fs = require('fs')

const productController = {
  getInventory: (req, res) => {
    Product.findAll({ where: { ShopId: req.user.ShopId } }).then(products => {
      res.render('inventory', { title: '庫存管理', products })
    })
  },

  postInventory: (req, res) => {
    let productsFile = req.files.products
    let uploadPath = '/Users/walle/CRM/uploadCsv/' + productsFile.name

    if (Object.keys(req.files).length == 0) {
      res.status(400).send('No files were uploaded.')
      return
    }

    productsFile.mv(uploadPath, function(err) {
      if (err) {
        return res.status(500).send(err)
      }
      console.log('File uploaded to ' + uploadPath)
    })
    csv()
      .fromFile(uploadPath)
      .then(function(jsonArrayObj) {
        console.log(jsonArrayObj)
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
