const express = require('express')
const authControllers = require('../../controllers/auth-controllers')
const router = express.Router()
const passport = require('../../config/passport')

router.get('/login', authControllers.getLoginPage)
router.get('/register', authControllers.getRegisterPage)

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login'
}), (req, res) => {
  req.flash('success_message', '成功登入!')
  return res.redirect('/')
})

module.exports = router
