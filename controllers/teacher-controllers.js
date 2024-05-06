const { Teacher, User, Lesson, Rating, Sequelize } = require('../models')
const { Op } = require('sequelize')

const teacherControllers = {
  getTeacherCreatePage: (req, res) => {
    return res.render('teacher-create')
  },
  getTeacherPage: (req, res, next) => {
    const teacherId = Number(req.params.id)
    if (teacherId !== req.user.id) throw new Error('沒有權限看此資料!')
    Teacher.findByPk(teacherId, {
      include: [
        {
          model: Lesson,
          include: [{ model: User, attributes: ['id', 'name'] }],
          where: {
            startTime: {
              [Op.gt]: new Date()
            }
          }
        },
        Rating
      ],
      attributes: {
        include: [
          [
            Sequelize.literal('(SELECT ROUND(AVG(rating), 1) FROM Ratings WHERE Ratings.teacher_id = Teacher.id)'), 'totalRating'
          ]
        ]
      }
    })
      .then(teacher => {
        teacher = teacher.toJSON()
        console.log('teacher', teacher)
        return res.render('teacher', { teacher })
      })
      .catch(err => next(err))
  },
  getTeacherEditPage: (req, res) => {
    return res.render('teacher-edit')
  }
}

module.exports = teacherControllers
