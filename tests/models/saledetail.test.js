const { expect } = require('chai')
const db = require('../../models')

describe('# SaleDetail Model', () => {
  describe('CRUD', () => {
    let data = null

    it('create', done => {
      db.SaleDetail.create({}).then(saleDetail => {
        data = saleDetail
        done()
      })
    })
    it('read', done => {
      db.SaleDetail.findByPk(data.id).then(saleDetail => {
        expect(data.id).to.be.equal(saleDetail.id)
        done()
      })
    })
    it('update', done => {
      db.SaleDetail.update({}, { where: { id: data.id } }).then(() => {
        db.SaleDetail.findByPk(data.id).then(saleDetail => {
          expect(data.updatedAt).to.be.not.equal(saleDetail.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.SaleDetail.destroy({ where: { id: data.id } }).then(() => {
        db.SaleDetail.findByPk(data.id).then(saleDetail => {
          expect(saleDetail).to.be.equal(null)
          done()
        })
      })
    })
  })
})
