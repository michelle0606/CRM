const chai = require('chai')
chai.use(require('sinon-chai'))
const { expect } = require('chai')
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists
} = require('sequelize-test-helpers')
const db = require('../../models')
const ProductModel = require('../../models/product')

describe('# Product Model', () => {

  const Product = ProductModel(sequelize, dataTypes)
  const product = new Product()

  context('check model name', () => {
    checkModelName(Product)('Product')
  })

  context('check properties', () => {
    ;[
      'name', 'salePrice', 'ShopId', 'inventory'
    ].forEach(checkPropertyExists(product))
  })

  context('check associations', () => {
    const ExpirationDate = ''
    const Sale = ''
    const Shop = ''

    before(() => {
      Product.associate({ ExpirationDate })
      Product.associate({ Sale })
      Product.associate({ Shop })
    })

   it('defined a belongsToMany association with ExpirationDate', () => {
      expect(Product.belongsToMany).to.have.been.calledWith(ExpirationDate)
    })
    it('defined a belongsToMany association with Sale', () => {
      expect(Product.belongsToMany).to.have.been.calledWith(Sale)
    })
    it('defined a belongsTo association with Shop', () => {
      expect(Product.belongsTo).to.have.been.calledWith(Shop)
    })
  })


  describe('chech CRUD', () => {
    let data = null

    it('create', done => {
      db.Product.create({}).then(product => {
        data = product
        done()
      })
    })
    it('read', done => {
      db.Product.findByPk(data.id).then(product => {
        expect(data.id).to.be.equal(product.id)
        done()
      })
    })
    it('update', done => {
      db.Product.update({}, { where: { id: data.id } }).then(() => {
        db.Product.findByPk(data.id).then(product => {
          expect(data.updatedAt).to.be.not.equal(product.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.Product.destroy({ where: { id: data.id } }).then(() => {
        db.Product.findByPk(data.id).then(product => {
          expect(product).to.be.equal(null)
          done()
        })
      })
    })
  })
})
