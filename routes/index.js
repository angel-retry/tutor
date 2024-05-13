const express = require('express')
const auth = require('./modules/auth')
const admin = require('./modules/admin')
const errorHandlers = require('../middlewares/error-handlers')
const userControllers = require('../controllers/user-controllers')
const teacherControllers = require('../controllers/teacher-controllers')
const lessonControllers = require('../controllers/lesson-controllers')
const router = express.Router()
const { userAuthenticated, studentAuthenticated, teacherAuthenticated } = require('../middlewares/auth-handlers')
const homeControllers = require('../controllers/home-controllers')
const upload = require('../middlewares/multer-helpers')
const ratingControllers = require('../controllers/rating-controllers')

router.use('', auth)
router.use('/admin', admin)

router.get('/home', userAuthenticated, homeControllers.getHomePage)

router.get('/users/:id', studentAuthenticated, userControllers.getUserPage)
router.put('/users/:id', studentAuthenticated, upload.single('avatar'), userControllers.putUser)
router.get('/users/:id/edit', studentAuthenticated, userControllers.getUserEditPage)

router.post('/teachers/create', studentAuthenticated, upload.single('avatar'), teacherControllers.createTeacher)
router.get('/teachers/create', studentAuthenticated, teacherControllers.getTeacherCreatePage)
router.get('/teachers/:id', teacherAuthenticated, teacherControllers.getTeacherPage)
router.put('/teachers/:id', teacherAuthenticated, upload.single('avatar'), teacherControllers.putTeacher)
router.get('/teachers/:id/edit', teacherAuthenticated, teacherControllers.getTeacherEditPage)

router.get('/lessons/:teacherId', userAuthenticated, lessonControllers.getLessonPage)
router.post('/lessons/:teacherId', studentAuthenticated, lessonControllers.postLesson)

router.post('/ratings/:teacherId', studentAuthenticated, ratingControllers.postRating)

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
