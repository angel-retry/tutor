const { Teacher, User, Lesson, Rating, Sequelize } = require('../models')
const { Op } = require('sequelize')

const weekdays = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.']

const teacherControllers = {
  getTeacherCreatePage: (req, res) => {
    const indexWeekdays = weekdays.map((day, i) => ({
      index: i,
      day
    }))
    return res.render('teacher-create', { indexWeekdays })
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
          },
          required: false
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
  getTeacherEditPage: (req, res, next) => {
    const teacherId = Number(req.params.id)
    if (teacherId !== req.user.id) throw new Error('沒有權限修改此資料')
    Teacher.findByPk(teacherId)
      .then(teacher => {
        if (!teacher) throw new Error('找不到此使用者。')
        teacher = teacher.toJSON()
        const indexWeekdays = weekdays.map((day, i) => ({
          index: i,
          day
        }))
        console.log('days', indexWeekdays)
        return res.render('teacher-edit', { teacher, indexWeekdays })
      })
      .catch(err => next(err))
  },
  createTeacher: (req, res, next) => {
    const { courseDescription, teachingMethod, lessonDuration, availableDays, videoLink } = req.body
    if (!courseDescription || !teachingMethod || !lessonDuration || !availableDays || !videoLink) throw new Error('請填入完整資料!')
    console.log({ courseDescription, teachingMethod, lessonDuration, availableDays, videoLink })
    Teacher.findByPk(req.user.id)
      .then(teacher => {
        if (teacher) throw new Error('此使用者已成為老師!')
        Promise.all([
          Teacher.create({
            id: req.user.id,
            courseDescription,
            teachingMethod,
            lessonDuration,
            availableDays,
            videoLink
          }),
          User.update({
            isTeacher: true
          }, {
            where: {
              id: req.user.id
            }
          })
        ])
      })
      .then(() => {
        req.flash('success', '恭喜開課成功!')
        return res.redirect(`/teachers/${req.user.id}`)
      })
      .catch(err => next(err))
  }
}

module.exports = teacherControllers
