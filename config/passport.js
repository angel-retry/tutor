const passport = require('passport')
const LocalStrategy = require('passport-local')
const { User, Admin } = require('../models')
const bcrypt = require('bcryptjs')
const GoogleStrategy = require('passport-google-oauth2').Strategy
const NODE_ENV = process.env.NODE_ENV || null

const callbackURL = NODE_ENV === 'production' ? process.env.ONLINE_GOOGLE_CALLBACK_URL : process.env.GOOGLE_CALLBACK_URL

// local策略
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL
}, (accessToken, refreshToken, profile, cb) => {
  const email = profile.email
  const name = profile.displayName
  const avatar = profile.picture

  User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        // 可加入資料判斷身分權限
        user.isAdmin = false
        user.isTeacher = false
        return cb(null, user)
      }
      const randomPwd = Math.random().toString(36).slice(-8)
      return bcrypt.hash(randomPwd, 10)
        .then(hashPassword => {
          return User.create({ name, email, password: hashPassword, avatar })
        })
        .then((newUser) => {
          newUser.isAdmin = false
          newUser.isTeacher = false
          return cb(null, newUser)
        })
        .catch(err => cb(err))
    })
    .catch(err => cb(err))
}))

// google策略
passport.use(new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, (req, email, password, cb) => {
  // User 和 Admin一起搜尋是否有這個信箱
  Promise.all([
    User.findOne({ where: { email } }),
    Admin.findOne({ where: { email } })
  ])
    .then(([user, admin]) => {
      // 兩者都沒有表示使用者帳密輸入錯誤
      if (!user && !admin) {
        return cb(null, false, req.flash('error_messages', '帳號密碼輸入錯誤!'))
      }

      // 有user為一般使用者
      if (user) {
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return cb(null, false, req.flash('error_messages', '帳號密碼輸入錯誤!'))
            }
            user.isAdmin = false
            return cb(null, user)
          })
          .catch(err => cb(err))
      }

      // 有admin為管理者
      if (admin) {
        return bcrypt.compare(password, admin.password)
          .then(isMatch => {
            if (!isMatch) {
              return cb(null, false, req.flash('error_messages', '帳號密碼輸入錯誤!'))
            }
            admin.isAdmin = true
            return cb(null, admin)
          })
          .catch(err => cb(err))
      }
    })
    .catch(err => cb(err))
}))

// 序列化
passport.serializeUser((user, cb) => {
  // 加入各個不同身分屬性，以便於反序列化判斷
  if (user.isAdmin) {
    return cb(null, { id: user.id, email: user.email, isAdmin: user.isAdmin })
  }
  if (!user.isAdmin && user.isTeacher) {
    return cb(null, { id: user.id, email: user.email, isTeacher: user.isTeacher })
  }
  if (!user.isAdmin && !user.isTeacher) {
    return cb(null, { id: user.id, email: user.email })
  }
})

// 反序列化
passport.deserializeUser((user, cb) => {
  // 判斷登入者身分，傳輸不同的身分資訊
  if (user.isAdmin) {
    return Admin.findOne({ where: { email: user.email } })
      .then((admin) => {
        admin = admin.toJSON()
        admin.isAdmin = true
        delete admin.password
        return cb(null, admin)
      })
  }
  if (user.isTeacher) {
    return User.findOne({ where: { email: user.email } })
      .then(teacher => {
        teacher = teacher.toJSON()
        teacher.isAdmin = false
        delete teacher.password
        return cb(null, teacher)
      })
  }
  return User.findOne({ where: { email: user.email } })
    .then(student => {
      student = student.toJSON()
      student.isAdmin = false
      delete student.password
      return cb(null, student)
    })
})

module.exports = passport
