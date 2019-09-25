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
const PurchaseRecordModel = require('../../models/purchaserecord')


describe('# PurchaseRecord Model', () => {

  const PurchaseRecord = PurchaseRecordModel(sequelize, dataTypes)
  const purchaseRecord = new PurchaseRecord()

  context('check model name', () => {
    checkModelName(PurchaseRecord)('PurchaseRecord')
  })

  context('check properties', () => {
    ;[
      'UserId', 'ShopId'
    ].forEach(checkPropertyExists(purchaseRecord))
  })

  context('check associations', () => {
    const User = ''
    const Product = ''
    const Shop = ''

    before(() => {
      PurchaseRecord.associate({ User })
      PurchaseRecord.associate({ Product })
      PurchaseRecord.associate({ Shop })
    })

   it('defined a belongsToMany association with Product', () => {
      expect(PurchaseRecord.belongsToMany).to.have.been.calledWith(Product)
    })
    it('defined a belongsTo association with User', () => {
      expect(PurchaseRecord.belongsTo).to.have.been.calledWith(User)
    })
    it('defined a belongsTo association with Shop', () => {
      expect(PurchaseRecord.belongsTo).to.have.been.calledWith(Shop)
    })
  })

  describe('check CRUD', () => {
    let data = null

    it('create', done => {
      db.PurchaseRecord.create({}).then(purchaseRecord => {
        data = purchaseRecord
        done()
      })
    })
    it('read', done => {
      db.PurchaseRecord.findByPk(data.id).then(purchaseRecord => {
        expect(data.id).to.be.equal(purchaseRecord.id)
        done()
      })
    })
    it('update', done => {
      db.PurchaseRecord.update({}, { where: { id: data.id } }).then(() => {
        db.PurchaseRecord.findByPk(data.id).then(purchaseRecord => {
          expect(data.updatedAt).to.be.not.equal(purchaseRecord.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.PurchaseRecord.destroy({ where: { id: data.id } }).then(() => {
        db.PurchaseRecord.findByPk(data.id).then(purchaseRecord => {
          expect(purchaseRecord).to.be.equal(null)
          done()
        })
      })
    })
  })
})
