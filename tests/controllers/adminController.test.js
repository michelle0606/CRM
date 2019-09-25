const assert = require('assert')
const moment = require('moment')
const chai = require('chai')
const request = require('supertest')
const should = chai.should()
const { expect } = require('chai')
var sinon = require('sinon')
const app = require('../../app')
const db = require('../../models')
var helpers = require('../../_helpers');
// const bcrypt = require('bcrypt-nodejs')

describe('# Admin Controller', function() {
	describe('Create a shop', function() {
		describe('+ Create a shop without a name', function() {
			before(async function() {
        this.stub1 = sinon.stub(helpers, 'ensureAuthenticated').returns(true)
        this.stub2 = sinon.stub(helpers, 'getUser').returns({ id: 1, role: 0 })
		  })

		  after(async function() {
		  	this.stub1.restore()
		  	this.stub2.restore()
		  })

			it('should redirect', function(done) {
				request(app)
          .post('/admin/shops')
          .send('name=')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err)
            done()
          })
			})
		})

		describe('+ Create a shop with a name', function() {
			before(async function() {
        this.stub1 = sinon.stub(helpers, 'ensureAuthenticated').returns(true)
        this.stub2 = sinon.stub(helpers, 'getUser').returns({ id: 1, role: 0 })
        await db.Shop.destroy({where: {},truncate: true})
		  })

		  after(async function() {
		  	this.stub1.restore()
		  	this.stub2.restore()
		  	await db.Shop.destroy({where: {},truncate: true})
		  })

			it('should successfully create a shop', function(done) {
				request(app)
          .post('/admin/shops')
          .send('name=shop1')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err)
            db.Shop.findOne({ where: { name: 'shop1' } }).then((shop) => {
            	expect(shop).to.not.be.null
            	done()
            })
          })
			})
		})

	})

	describe('Read the info of all shops', function() {
		describe('+ Without login', function() {
      it('should redirect', function(done) {
        request(app)
          .get('/admin/shops')
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
        this.stub2 = sinon.stub(helpers, 'getUser').returns({ id: 1, role: 2 })
		  })

		  after(async function() {
		  	this.stub1.restore()
		  	this.stub2.restore()
		  })

		  it('should redirect', function(done) {
		  	request(app)
          .get('/admin/shops')
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
        this.stub2 = sinon.stub(helpers, 'getUser').returns({ id: 1, role: 1 })
		  })

		  after(async function() {
		  	this.stub1.restore()
		  	this.stub2.restore()
		  })

		  it('should redirect', function(done) {
		  	request(app)
          .get('/admin/shops')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err)
            done()
          })
		  })
    })

    describe('+ Log in as an administrator', function(done) {
    	before(async function() {
        this.stub1 = sinon.stub(helpers, 'ensureAuthenticated').returns(true)
        this.stub2 = sinon.stub(helpers, 'getUser').returns({ id: 1, role: 0 })
        await db.Shop.destroy({where: {},truncate: true})
        await db.Shop.create({ name: 'Shop1'})
        await db.Shop.create({ name: 'Shop2'})
		  })

		  after(async function() {
		  	this.stub1.restore()
		  	this.stub2.restore()
		    await db.Shop.destroy({where: {},truncate: true})
		  })

		  it('should respond with all shops', function(done) {
		  	request(app)
          .get('/admin/shops')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err)
            res.text.should.include('Shop1')
          	res.text.should.include('Shop2')
            done()
          })
		  })
    })
  })

	describe('Update the info of a shop', function() {
		describe('+ Update the name of a shop', () => {
			before(async function() {
        this.stub1 = sinon.stub(helpers, 'ensureAuthenticated').returns(true)
        this.stub2 = sinon.stub(helpers, 'getUser').returns({ id: 1, role: 0 })
        await db.Shop.destroy({where: {},truncate: true})
        await db.Shop.create({})
		  })

		  after(async function() {
		  	this.stub1.restore()
		  	this.stub2.restore()
		    await db.Shop.destroy({where: {},truncate: true})
		  })

      it('should successfully update the name of the shop', (done) => {
        request(app)
          .post('/admin/shops/1?_method=PUT')
          .send('name=abc')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err)
            db.Shop.findByPk(1).then((shop) => {
              shop.name.should.equal('abc')
              return done()
            })
          });
      })
    })
	})

	describe('Delete a shop', function() {
		describe('+ Delete a shop', function() {
			before(async function() {
        this.stub1 = sinon.stub(helpers, 'ensureAuthenticated').returns(true)
        this.stub2 = sinon.stub(helpers, 'getUser').returns({ id: 1, role: 0 })
        await db.Shop.destroy({where: {},truncate: true})
        await db.Shop.create({})
		  })

		  after(async function() {
		  	this.stub1.restore()
		  	this.stub2.restore()
		    await db.Shop.destroy({where: {},truncate: true})
		  })

			it('should successfully delete the shop', (done) => {
        request(app)
          .delete('/admin/shops/1')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err)
            db.Shop.findAll().then((shops) => {
              expect(shops).to.be.an('array').that.is.empty
              done()
            })
          })
      })
		})
	})
})
