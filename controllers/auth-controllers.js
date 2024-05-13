const { User } = require('../models')
const bcrypt = require('bcryptjs')

const authControllers = {
  getLoginPage: (req, res) => {
    return res.render('auth/login')
  },
  getRegisterPage: (req, res) => {
    return res.render('auth/register')
  },
  postRegister: (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body
    if (!name || !email || !password || !confirmPassword) throw new Error('請完全輸入表單內容!')
    if (password !== confirmPassword) throw new Error('兩次密碼不一致!')

    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('此信箱已被註冊!')
        return bcrypt.hash(password, 10)
      })
      .then(hashedPassword => {
        return User.create({ name, email, password: hashedPassword })
      })
      .then(() => {
        req.flash('success_messages', '註冊成功!')
        return res.redirect('/login')
      })
      .catch(err => next(err))
  },
  postLogout: (req, res, next) => {
    req.logout(err => {
      if (err) return next(err)
      return res.redirect('/login')
    })
  }
}

module.exports = authControllers
