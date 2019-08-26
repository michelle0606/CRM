const { expect } = require('chai')
const db = require('../../models')

describe('# Tag Model', () => {
  describe('CRUD', () => {
    let data = null

    it('create', done => {
      db.Tag.create({}).then(tag => {
        data = tag
        done()
      })
    })
    it('read', done => {
      db.Tag.findByPk(data.id).then(tag => {
        expect(data.id).to.be.equal(tag.id)
        done()
      })
    })
    it('update', done => {
      db.Tag.update({}, { where: { id: data.id } }).then(() => {
        db.Tag.findByPk(data.id).then(tag => {
          expect(data.updatedAt).to.be.not.equal(tag.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.Tag.destroy({ where: { id: data.id } }).then(() => {
        db.Tag.findByPk(data.id).then(tag => {
          expect(tag).to.be.equal(null)
          done()
        })
      })
    })
  })
})
