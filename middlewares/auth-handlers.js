const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')

// 宣告authenticated接收身分進行各個權限處理
const authenticated = (users) => {
  return (req, res, next) => {
    const user = getUser(req)

    // 如果有登入
    if (ensureAuthenticated(req)) {
      // 此為admin身分
      if (users === 'admin' && user.isAdmin) {
        return next()
      }
      // 此為一般使用者身分
      if (users === 'user' && !user.isAdmin) {
        return next()
      }
      // 此為老師身分
      if (users === 'teacher' && user.isTeacher && !user.isAdmin) {
        return next()
      }
      // 此為學生身分
      if (users === 'student' && !user.isTeacher && !user.isAdmin) {
        return next()
      }
      // 如沒有以上身分，導向上一頁
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
