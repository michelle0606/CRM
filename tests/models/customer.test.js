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
const CustomerModel = require('../../models/customer')

describe('# Customer Model', () => {

  const Customer = CustomerModel(sequelize, dataTypes)
  const customer = new Customer()

  context('check model name', () => {
    checkModelName(Customer)('Customer')
  })

  context('check properties', () => {
    ;[
      'phoneNr', 'email', 'name', 'ShopId'
    ].forEach(checkPropertyExists(customer))
  })

  context('check associations', () => {
    const Tag = ''
    const Sale = ''
    const Shop = ''

    before(() => {
      Customer.associate({ Tag })
      Customer.associate({ Sale })
      Customer.associate({ Shop })
    })

    it('defined a belongsToMany association with Tag', () => {
      expect(Customer.belongsToMany).to.have.been.calledWith(Tag)
    })
    it('defined a hasMany association with Sale', () => {
      expect(Customer.hasMany).to.have.been.calledWith(Sale)
    })
    it('defined a belongsTo association with Shop', () => {
      expect(Customer.belongsTo).to.have.been.calledWith(Shop)
    })
  })

  describe('check CRUD', () => {
    let data = null

    it('create', done => {
      db.Customer.create({}).then(customer => {
        data = customer
        done()
      })
    })
    it('read', done => {
      db.Customer.findByPk(data.id).then(customer => {
        expect(data.id).to.be.equal(customer.id)
        done()
      })
    })
    it('update', done => {
      db.Customer.update({}, { where: { id: data.id } }).then(() => {
        db.Customer.findByPk(data.id).then(customer => {
          expect(data.updatedAt).to.be.not.equal(customer.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.Customer.destroy({ where: { id: data.id } }).then(() => {
        db.Customer.findByPk(data.id).then(customer => {
          expect(customer).to.be.equal(null)
          done()
        })
      })
    })
  })
})
