const express = require('express')
const authControllers = require('../../controllers/auth-controllers')
const router = express.Router()

router.get('/login', authControllers.getLoginPage)

module.exports = router
