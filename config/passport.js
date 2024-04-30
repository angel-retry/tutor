const passport = require('passport')
const LocalStrategy = require('passport-local')
const { User, Admin } = require('../models')
const bcrypt = require('bcryptjs')

passport.use(new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, (req, email, password, cb) => {
  Promise.all([
    User.findOne({ where: { email } }),
    Admin.findOne({ where: { email } })
  ])
    .then(([user, admin]) => {
      if (!user && !admin) {
        return cb(null, false, req.flash('error_message', '帳號密碼輸入錯誤!'))
      }

      if (user) {
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return cb(null, false, req.flash('error_message', '帳號密碼輸入錯誤!'))
            }
            user.isAdmin = false
            return cb(null, user)
          })
          .catch(err => cb(err))
      }

      if (admin) {
        return bcrypt.compare(password, admin.password)
          .then(isMatch => {
            if (!isMatch) {
              return cb(null, false, req.flash('error_message', '帳號密碼輸入錯誤!'))
            }
            admin.isAdmin = true
            return cb(null, admin)
          })
          .catch(err => cb(err))
      }
    })
    .catch(err => cb(err))
}))

passport.serializeUser((user, cb) => {
  if (user.isAdmin) {
    console.log('serializeUser', { id: user.id, email: user.email, isAdmin: user.isAdmin })
    return cb(null, { id: user.id, email: user.email, isAdmin: user.isAdmin })
  }
  if (!user.isAdmin && user.isTeacher) {
    console.log('serializeUser', { id: user.id, email: user.email, isTeacher: user.isTeacher })
    return cb(null, { id: user.id, email: user.email, isTeacher: user.isTeacher })
  }
  if (!user.isAdmin && !user.isTeacher) {
    console.log('serializeUser', { id: user.id, email: user.email })
    return cb(null, { id: user.id, email: user.email })
  }
})

passport.deserializeUser((user, cb) => {
  console.log('deserializeUser', user)
  if (user.isAdmin) {
    return Admin.findOne({ where: { email: user.email } })
      .then((admin) => {
        admin = admin.toJSON()
        admin.isAdmin = true
        delete admin.password
        console.log('admin', admin)
        return cb(null, admin)
      })
  }
  if (user.isTeacher) {
    return User.findOne({ where: { email: user.email } })
      .then(teacher => {
        teacher = teacher.toJSON()
        teacher.isAdmin = false
        delete teacher.password
        console.log('teacher', teacher)
        return cb(null, teacher)
      })
  }
  return User.findOne({ where: { email: user.email } })
    .then(student => {
      student = student.toJSON()
      student.isAdmin = false
      delete student.password
      console.log('student', student)
      return cb(null, student)
    })
})

module.exports = passport
