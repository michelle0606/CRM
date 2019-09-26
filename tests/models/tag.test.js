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
const TagModel = require('../../models/tag')

describe('# Tag Model', () => {
  const Tag = TagModel(sequelize, dataTypes)
  const tag = new Tag()

  context('check model name', () => {
    checkModelName(Tag)('Tag')
  })

  context('check properties', () => {
    ;['tag', 'ShopId'].forEach(checkPropertyExists(tag))
  })

  context('check associations', () => {
    const Customer = ''
    const Shop = ''

    before(() => {
      Tag.associate({ Customer })
      Tag.associate({ Shop })
    })

    it('defined a belongsToMany association with Customer', () => {
      expect(Tag.belongsToMany).to.have.been.calledWith(Customer)
    })
    it('defined a belongsTo association with Shop', () => {
      expect(Tag.belongsTo).to.have.been.calledWith(Shop)
    })
  })

  context('check CRUD', () => {
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
