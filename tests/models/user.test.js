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
const UserModel = require('../../models/user')

describe('# User Model', () => {
  const User = UserModel(sequelize, dataTypes)
  const user = new User()

  context('check model name', () => {
    checkModelName(User)('User')
  })

  context('check properties', () => {
    ;[
      'name', 'password', 'role'
    ].forEach(checkPropertyExists(user))
  })

  context('check associations', () => {
    const Sale = ''
    const Shop = ''

    before(() => {
      User.associate({ Sale })
      User.associate({ Shop })
    })

    it('defined a hasMany association with Sale', () => {
      expect(User.hasMany).to.have.been.calledWith(Sale)
    })
    it('defined a belongsTo association with Shop', () => {
      expect(User.belongsTo).to.have.been.calledWith(Shop)
    })
  })

  context('check CRUD', () => {
    let data = null

    it('create', done => {
      db.User.create({}).then(user => {
        data = user
        done()
      })
    })
    it('read', done => {
      db.User.findByPk(data.id).then(user => {
        expect(data.id).to.be.equal(user.id)
        done()
      })
    })
    it('update', done => {
      db.User.update({}, { where: { id: data.id } }).then(() => {
        db.User.findByPk(data.id).then(user => {
          expect(data.updatedAt).to.be.not.equal(user.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.User.destroy({ where: { id: data.id } }).then(() => {
        db.User.findByPk(data.id).then(user => {
          expect(user).to.be.equal(null)
          done()
        })
      })
    })
  })
})
