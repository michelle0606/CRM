const { expect } = require('chai')
const db = require('../../models')

describe('# CustomerDetail Model', () => {
  describe('CRUD', () => {
    let data = null

    it('create', done => {
      db.CustomerDetail.create({}).then(customerDetail => {
        data = customerDetail
        done()
      })
    })
    it('read', done => {
      db.CustomerDetail.findByPk(data.id).then(customerDetail => {
        expect(data.id).to.be.equal(customerDetail.id)
        done()
      })
    })
    it('update', done => {
      db.CustomerDetail.update({}, { where: { id: data.id } }).then(() => {
        db.CustomerDetail.findByPk(data.id).then(customerDetail => {
          expect(data.updatedAt).to.be.not.equal(customerDetail.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.CustomerDetail.destroy({ where: { id: data.id } }).then(() => {
        db.CustomerDetail.findByPk(data.id).then(customerDetail => {
          expect(customerDetail).to.be.equal(null)
          done()
        })
      })
    })
  })
})
