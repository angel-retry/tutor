const express = require('express')
const auth = require('./modules/auth')
const admin = require('./modules/admin')
const errorHandlers = require('../middlewares/error-handlers')
const userControllers = require('../controllers/user-controllers')
const teacherControllers = require('../controllers/teacher-controllers')
const lessonControllers = require('../controllers/lesson-controllers')
const router = express.Router()
const { userAuthenticated, studentAuthenticated } = require('../middlewares/auth-handlers')
const homeControllers = require('../controllers/home-controllers')
const upload = require('../middlewares/multer-helpers')

router.use('', auth)
router.use('/admin', admin)

router.get('/home', userAuthenticated, homeControllers.getHomePage)

router.get('/users/:id', userControllers.getUserPage)
router.put('/users/:id', upload.single('avatar'), userControllers.putUser)
router.get('/users/:id/edit', userControllers.getUserEditPage)

router.get('/teachers/create', studentAuthenticated, teacherControllers.getTeacherCreatePage)
router.get('/teachers/:id', teacherControllers.getTeacherPage)
router.get('/teachers/:id/edit', teacherControllers.getTeacherEditPage)

router.get('/lessons/:id', lessonControllers.getLessonPage)

router.use('/', (req, res, next) => {
  const user = req.user
  if (user) {
    if (!user.isAdmin) {
      return res.redirect('/home')
    }
    return res.redirect('/admin')
  }
  return res.redirect('/login')
})

router.use('', errorHandlers)

module.exports = router
