const express = require('express')
const authControllers = require('../../controllers/auth-controllers')
const router = express.Router()

router.get('/login', authControllers.getLoginPage)
router.get('/register', authControllers.getRegisterPage)

module.exports = router
