const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')

const authenticated = (users) => {
  return (req, res, next) => {
    const user = getUser(req)
    console.log('auth-handler', user)
    if (ensureAuthenticated(req)) {
      if (users === 'admin' && user.isAdmin) {
        return next()
      }
      if (users === 'user' && !user.isAdmin) {
        return next()
      }
      if (users === 'teacher' && user.isTeacher && !user.isAdmin) {
        return next()
      }
      if (users === 'student' && !user.isTeacher && !user.isAdmin) {
        return next()
      }
      req.flash('error_messages', '沒有權限瀏覽!')
      return res.redirect('back')
    }
    req.flash('error_messages', '請先登入!')
    return res.redirect('/login')
  }
}

const userAuthenticated = authenticated('user')
const studentAuthenticated = authenticated('student')
const teacherAuthenticated = authenticated('teacher')
const adminAuthenticated = authenticated('admin')

module.exports = {
  userAuthenticated,
  studentAuthenticated,
  teacherAuthenticated,
  adminAuthenticated
}
