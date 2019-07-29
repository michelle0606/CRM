const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/customers')
const adminRouter = require('./routes/admin')
const passport = require('./config/passport')
const flash = require('connect-flash')
const session = require('express-session')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))

app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter)
app.use('/customers', usersRouter)
app.use('/admin', adminRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

module.exports = app
