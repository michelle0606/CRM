const { expect } = require('chai')
const db = require('../../models')

describe('# ProductExpDateDetail Model', () => {
  describe('CRUD', () => {
    let data = null

    it('create', done => {
      db.ProductExpDateDetail.create({}).then(productExpDateDetail => {
        data = productExpDateDetail
        done()
      })
    })
    it('read', done => {
      db.ProductExpDateDetail.findByPk(data.id).then(productExpDateDetail => {
        expect(data.id).to.be.equal(productExpDateDetail.id)
        done()
      })
    })
    it('update', done => {
      db.ProductExpDateDetail.update({}, { where: { id: data.id } }).then(
        () => {
          db.ProductExpDateDetail.findByPk(data.id).then(
            productExpDateDetail => {
              expect(data.updatedAt).to.be.not.equal(
                productExpDateDetail.updatedAt
              )
              done()
            }
          )
        }
      )
    })
    it('delete', done => {
      db.ProductExpDateDetail.destroy({ where: { id: data.id } }).then(() => {
        db.ProductExpDateDetail.findByPk(data.id).then(productExpDateDetail => {
          expect(productExpDateDetail).to.be.equal(null)
          done()
        })
      })
    })
  })
})
