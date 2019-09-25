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
const ShopModel = require('../../models/shop')

describe('# Shop Model', () => {
  const Shop = ShopModel(sequelize, dataTypes)
  const shop = new Shop()

  context('check model name', () => {
    checkModelName(Shop)('Shop')
  })

  context('check properties', () => {
    ;[
      'name', 'email', 'phoneNr'
    ].forEach(checkPropertyExists(shop))
  })

  context('check associations', () => {
    const Tag = ''
    const Customer = ''
    const User = ''
    const Product = ''
    const Sale = ''
    const ExpirationDate = ''

    before(() => {
      Shop.associate({ Tag })
      Shop.associate({ Customer })
      Shop.associate({ User })
      Shop.associate({ Product })
      Shop.associate({ Sale })
      Shop.associate({ ExpirationDate })
    })

    it('defined a hasMany association with Tag', () => {
      expect(Shop.hasMany).to.have.been.calledWith(Tag)
    })
    it('defined a hasMany association with Customer', () => {
      expect(Shop.hasMany).to.have.been.calledWith(Customer)
    })
    it('defined a hasMany association with User', () => {
      expect(Shop.hasMany).to.have.been.calledWith(User)
    })
    it('defined a hasMany association with Product', () => {
      expect(Shop.hasMany).to.have.been.calledWith(Product)
    })
    it('defined a hasMany association with Sale', () => {
      expect(Shop.hasMany).to.have.been.calledWith(Sale)
    })
    it('defined a hasMany association with ExpirationDate', () => {
      expect(Shop.hasMany).to.have.been.calledWith(ExpirationDate)
    })
  })

  context('check CRUD', () => {
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
