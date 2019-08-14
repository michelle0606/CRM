const assert = require('assert')
const moment = require('moment')
const chai = require('chai')
const request = require('supertest')
const should = chai.should()
const { expect } = require('chai')

const db = require('../../models')

describe('# Customer Model', () => {
  describe('CRUD', () => {
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
