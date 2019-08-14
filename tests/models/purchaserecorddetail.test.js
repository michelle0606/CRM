const { expect } = require('chai')
const db = require('../../models')

describe('# PurchaseRecordDetail Model', () => {
  describe('CRUD', () => {
    let data = null

    it('create', done => {
      db.PurchaseRecordDetail.create({}).then(purchaseRecordDetail => {
        data = purchaseRecordDetail
        done()
      })
    })
    it('read', done => {
      db.PurchaseRecordDetail.findByPk(data.id).then(purchaseRecordDetail => {
        expect(data.id).to.be.equal(purchaseRecordDetail.id)
        done()
      })
    })
    it('update', done => {
      db.PurchaseRecordDetail.update({}, { where: { id: data.id } }).then(
        () => {
          db.PurchaseRecordDetail.findByPk(data.id).then(
            purchaseRecordDetail => {
              expect(data.updatedAt).to.be.not.equal(
                purchaseRecordDetail.updatedAt
              )
              done()
            }
          )
        }
      )
    })
    it('delete', done => {
      db.PurchaseRecordDetail.destroy({ where: { id: data.id } }).then(() => {
        db.PurchaseRecordDetail.findByPk(data.id).then(purchaseRecordDetail => {
          expect(purchaseRecordDetail).to.be.equal(null)
          done()
        })
      })
    })
  })
})
