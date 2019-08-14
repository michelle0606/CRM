const { expect } = require('chai')
const db = require('../../models')

describe('# Shop Model', () => {
  describe('CRUD', () => {
    let data = null

    it('create', done => {
      db.Shop.create({}).then(shop => {
        data = shop
        done()
      })
    })
    it('read', done => {
      db.Shop.findByPk(data.id).then(shop => {
        expect(data.id).to.be.equal(shop.id)
        done()
      })
    })
    it('update', done => {
      db.Shop.update({}, { where: { id: data.id } }).then(() => {
        db.Shop.findByPk(data.id).then(shop => {
          expect(data.updatedAt).to.be.not.equal(shop.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.Shop.destroy({ where: { id: data.id } }).then(() => {
        db.Shop.findByPk(data.id).then(shop => {
          expect(shop).to.be.equal(null)
          done()
        })
      })
    })
  })
})
