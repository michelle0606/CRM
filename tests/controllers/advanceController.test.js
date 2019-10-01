const assert = require('assert')
const moment = require('moment')
const chai = require('chai')
const request = require('supertest')
const should = chai.should()
const { expect } = require('chai')
var sinon = require('sinon')
const app = require('../../app')
const db = require('../../models')
var helpers = require('../../_helpers')

describe('# Advance Controller', function() {
	describe('Read the info of the shop', function() {
		describe('+ Without login', function() {
			it('should redirect', function(done) {
        request(app)
          .get('/advance/shops/1')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err)
            done()
          })
      })
		})

		describe('+ Log in as a salesperson', function(done) {
    	before(async function() {
        this.stub1 = sinon.stub(helpers, 'ensureAuthenticated').returns(true)
        this.stub2 = sinon.stub(helpers, 'getUser').returns({ id: 1, role: 2, ShopId: 1 })
        await db.Shop.destroy({where: {},truncate: true})
        await db.Shop.create({ id: 1, name: 'Shop1'})
		  })

		  after(async function() {
		  	this.stub1.restore()
		  	this.stub2.restore()
		  	await db.Shop.destroy({where: {},truncate: true})
		  })

		  it('should redirect', function(done) {
		  	request(app)
          .get('/advance/shops/1')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err)
            done()
          })
		  })
    })

		describe('+ Log in as a manager', function(done) {
			before(async function() {
        this.stub1 = sinon.stub(helpers, 'ensureAuthenticated').returns(true)
        this.stub2 = sinon.stub(helpers, 'getUser').returns({ id: 1, role: 1, ShopId: 1 })
        await db.Shop.destroy({where: {},truncate: true})
        await db.Shop.create({ id: 1, name: 'Shop1'})
		  })

		  after(async function() {
		  	this.stub1.restore()
		  	this.stub2.restore()
		    await db.Shop.destroy({where: {},truncate: true})
		  })

		  it('should respond with the info of the shop', function(done) {
		  	request(app)
          .get('/advance/shops/1')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err)
            res.text.should.include('Shop1')
            done()
          })
		  })
		})

		describe('+ Log in as an administrator', function(done) {
    	before(async function() {
        this.stub1 = sinon.stub(helpers, 'ensureAuthenticated').returns(true)
        this.stub2 = sinon.stub(helpers, 'getUser').returns({ id: 1, role: 0, ShopId: 1 })
        await db.Shop.destroy({where: {},truncate: true})
        await db.Shop.create({ id: 1, name: 'Shop1'})
		  })

		  after(async function() {
		  	this.stub1.restore()
		  	this.stub2.restore()
		  	await db.Shop.destroy({where: {},truncate: true})
		  })

		  it('should redirect', function(done) {
		  	request(app)
          .get('/advance/shops/1')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err)
            done()
          })
		  })
    })

		describe('+ Access info from other shops', function(done) {
			before(async function() {
        this.stub1 = sinon.stub(helpers, 'ensureAuthenticated').returns(true)
        this.stub2 = sinon.stub(helpers, 'getUser').returns({ id: 1, role: 1, ShopId: 1 })
        await db.Shop.destroy({where: {},truncate: true})
        await db.Shop.create({ id: 1, name: 'Shop1'})
        await db.Shop.create({ id: 2, name: 'Shop2'})
		  })

		  after(async function() {
		  	this.stub1.restore()
		  	this.stub2.restore()
		    await db.Shop.destroy({where: {},truncate: true})
		  })

		  it('should redirect', function(done) {
		  	request(app)
          .get('/advance/shops/2')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err)
            done()
          })
		  })
		})
	})
})
