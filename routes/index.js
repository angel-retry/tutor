const express = require('express')
const auth = require('./modules/auth')
const router = express.Router()

router.use('', auth)
router.get('/', (req, res) => {
  res.render('index')
})

module.exports = router
