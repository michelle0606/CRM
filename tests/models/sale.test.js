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
const SaleModel = require('../../models/sale')

describe('# Sale Model', () => {

  const Sale = SaleModel(sequelize, dataTypes)
  const sale = new Sale()

  context('check model name', () => {
    checkModelName(Sale)('Sale')
  })

  context('check properties', () => {
    ;[
      'total', 'CustomerId', 'ShopId'
    ].forEach(checkPropertyExists(sale))
  })

  context('check associations', () => {
    const Customer = ''
    const User = ''
    const Product = ''
    const Shop = ''

    before(() => {
      Sale.associate({ Customer })
      Sale.associate({ User })
      Sale.associate({ Product })
      Sale.associate({ Shop })
    })

    it('defined a hasMany association with Product', () => {
      expect(Sale.belongsToMany).to.have.been.calledWith(Product)
    })
    it('defined a belongsTo association with Customer', () => {
      expect(Sale.belongsTo).to.have.been.calledWith(Customer)
    })
    it('defined a belongsTo association with User', () => {
      expect(Sale.belongsTo).to.have.been.calledWith(User)
    })
    it('defined a belongsTo association with Shop', () => {
      expect(Sale.belongsTo).to.have.been.calledWith(Shop)
    })
  })

  context('check CRUD', () => {
    let data = null

    it('create', done => {
      db.Sale.create({}).then(sale => {
        data = sale
        done()
      })
    })
    it('read', done => {
      db.Sale.findByPk(data.id).then(sale => {
        expect(data.id).to.be.equal(sale.id)
        done()
      })
    })
    it('update', done => {
      db.Sale.update({}, { where: { id: data.id } }).then(() => {
        db.Sale.findByPk(data.id).then(sale => {
          expect(data.updatedAt).to.be.not.equal(sale.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.Sale.destroy({ where: { id: data.id } }).then(() => {
        db.Sale.findByPk(data.id).then(sale => {
          expect(sale).to.be.equal(null)
          done()
        })
      })
    })
  })
})
