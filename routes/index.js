const express = require('express')
const auth = require('./modules/auth')
const errorHandlers = require('../middlewares/error-handlers')
const router = express.Router()

router.use('', auth)
router.get('/', (req, res) => {
  res.render('index')
})

router.use('', errorHandlers)

module.exports = router
