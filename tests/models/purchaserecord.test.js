const { expect } = require('chai')
const db = require('../../models')

describe('# PurchaseRecord Model', () => {
  describe('CRUD', () => {
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
