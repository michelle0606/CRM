const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User

passport.use(
  new LocalStrategy(
    {
      usernameField: 'account',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, username, password, cb) => {
      User.findOne({ where: { id: username } }).then(user => {
        if (!user) return cb(null, false)
        if (!bcrypt.compareSync(password, user.password)) return cb(null, false)
        return cb(null, user)
      })
    }
  )
)

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  // console.log('sssssssssserializeeeeeee')
  // console.log(user)
  cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
  // console.log('dddeeesseriali')
  User.findByPk(id, {
    include: [
      // { model: Restaurant, as: 'FavoritedRestaurants' },
      // { model: Restaurant, as: 'LikedRestaurants' },
      // { model: User, as: 'Followers' },
      // { model: User, as: 'Followings' }
    ]
  }).then(user => {
    // console.log(user)
    return cb(null, user)
  })
})

module.exports = passport
