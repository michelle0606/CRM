const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const indexRouter = require('./routes/index')
const advanceRouter = require('./routes/advance')
const customersRouter = require('./routes/customers')
const passport = require('./config/passport')
const flash = require('connect-flash')
const session = require('express-session')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const dotenv = require('dotenv')
const hbs = require('express-handlebars')
const hbshelpers = require('handlebars-helpers')
const multihelpers = hbshelpers()
const app = express()

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

// set session store
const db = require('./models')
const SequelizeStore = require('connect-session-sequelize')(session.Store)

app.use(
  session({
    secret: 'secret',
    saveUninitialized: false,
    store: new SequelizeStore({
      db: db.sequelize
    }),
    resave: false,
    proxy: true
  })
)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.engine(
  'hbs',
  hbs({
    helpers: multihelpers,
    partialsDir: ['views/partials'],
    extname: '.hbs',
    layoutsDir: 'views',
    defaultLayout: 'layout'
  })
)
app.set('view engine', 'hbs')

app.use(flash())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.top_messages = req.flash('top_messages')
  next()
})

app.use('/', indexRouter)
app.use('/advance', advanceRouter)
app.use('/customers', customersRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})
module.exports = app
