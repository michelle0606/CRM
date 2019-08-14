const { expect } = require('chai')
const db = require('../../models')

describe('# Sale Model', () => {
  context('CRUD', () => {
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
