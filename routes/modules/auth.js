const express = require('express')
const authControllers = require('../../controllers/auth-controllers')
const router = express.Router()
const passport = require('../../config/passport')

router.get('/login', authControllers.getLoginPage)
router.get('/register', authControllers.getRegisterPage)

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login'
}), (req, res) => {
  req.flash('success_messages', '成功登入!')
  return res.redirect('/')
})

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/home',
  failureRedirect: '/login'
}))

router.post('/register', authControllers.postRegister)

router.post('/logout', authControllers.postLogout)

module.exports = router
