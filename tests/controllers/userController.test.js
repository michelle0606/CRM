const assert = require('assert')
const moment = require('moment')
const chai = require('chai')
const request = require('supertest')
const should = chai.should()
const { expect } = require('chai')

const app = require('../../app')
const db = require('../../models')
const bcrypt = require('bcrypt-nodejs')

describe('# User controller', function() {
  before(async function() {
    await db.User.destroy({where: {},truncate: true})
  })

  after(async function() {
    await db.User.destroy({where: {},truncate: true})
  })

  beforeEach(function() {
  })

  afterEach(function() {
  })

  it('signup with inccorect password', done => {
    request(app)
      .post('/signup')
      .send('name=name&email=email&password=password&password2=password123')
      .expect(302)
      .end(function(err, res) {
        db.Shop.findOne({
          where: {
            email: 'email'
          }
        }).then(shop => {
          expect(shop).to.be.equal(null)
          done()
        })
      })
  })

  it('signup with unsave password', done => {
    request(app)
      .post('/signup')
      .send('name=name&email=email&password=pass&password2=pass')
      .expect(302)
      .end(function(err, res) {
        db.Shop.findOne({
          where: {
            email: 'email'
          }
        }).then(shop => {
          expect(shop).to.be.equal(null)
          done()
        })
      })
  })

   it('signup successfully', done => {
    request(app)
      .post('/signup')
      .send('name=name&email=email&password=password&password2=password')
      .expect(302)
      .end(function(err, res) {
        db.Shop.findOne({
          where: {
            email: 'email'
          }
        }).then(shop => {
          db.User.findOne({
            where: {},
            order: [['createdAt', 'DESC']]
          }).then(user => {
            expect(shop.email).to.be.equal('email')
            expect(bcrypt.compareSync('password', user.password)).to.be.equal(true)
            done()
          })
        })
      })
  })
})
