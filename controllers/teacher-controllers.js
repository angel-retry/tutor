const teacherControllers = {
  getTeacherCreatePage: (req, res) => {
    return res.render('teacher-create')
  },
  getTeacherPage: (req, res) => {
    return res.render('teacher')
  },
  getTeacherEditPage: (req, res) => {
    return res.render('teacher-edit')
  }
}

module.exports = teacherControllers
