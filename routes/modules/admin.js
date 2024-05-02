const express = require('express')
const router = express.Router()
const adminControllers = require('../../controllers/admin-controllers')
const { adminAuthenticated } = require('../../middlewares/auth-handlers')

router.get('/', adminAuthenticated, adminControllers.getAdminPage)

module.exports = router
