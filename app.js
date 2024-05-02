require('dotenv').config()
const express = require('express')
const router = require('./routes')
const app = express()
const { engine } = require('express-handlebars')
const passport = require('./config/passport')
const session = require('express-session')
const flash = require('connect-flash')
const { getUser } = require('./helpers/auth-helpers')

app.engine('hbs', engine({ extname: 'hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})

app.use(router)

app.listen(3000, () => {
  console.log('Example app listening on http://localhost:3000')
})
