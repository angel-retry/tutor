require('dotenv').config()
const express = require('express')
const router = require('./routes')
const app = express()
const { engine } = require('express-handlebars')
const passport = require('./config/passport')
const session = require('express-session')
const flash = require('connect-flash')
const { getUser } = require('./helpers/auth-helpers')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const methodOverride = require('method-override')
const path = require('path')
const { getAddLessonMessage } = require('./helpers/add-lesson-helpers')

app.engine('hbs', engine({ extname: 'hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use((req, res, next) => {
  const addLessonErrorTeacher = req.flash('add_lesson_error_teacher')
  const addLessonErrorStudent = req.flash('add_lesson_error_student')
  const addLessonSuccess = req.flash('add_lesson_success')

  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.add_lesson_error_teacher = getAddLessonMessage(addLessonErrorTeacher)
  res.locals.add_lesson_error_student = getAddLessonMessage(addLessonErrorStudent)
  res.locals.add_lesson_success = getAddLessonMessage(addLessonSuccess)
  res.locals.user = getUser(req)
  next()
})

app.use(router)

app.listen(3000, () => {
  console.log('Example app listening on http://localhost:3000')
})
