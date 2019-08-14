const { expect } = require('chai')
const db = require('../../models')

describe('# Product Model', () => {
  describe('CRUD', () => {
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
