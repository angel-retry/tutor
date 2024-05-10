const localFileHandler = require('../helpers/file-helpers')
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
      attributes: [
        'id',
        'courseDescription',
        'teachingMethod',
        [
          Sequelize.literal('(SELECT ROUND(AVG(rating), 1) FROM Ratings WHERE Ratings.teacher_id = Teacher.id)'), 'totalRating'
        ]
      ],
      order: [[Lesson, 'createdAt', 'DESC']]
    })
      .then(teacher => {
        if (!teacher) throw new Error('沒有這為使用者老師的資料!')
        teacher = {
          ...teacher.toJSON()
        }
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
        return res.render('teacher-edit', { teacher, indexWeekdays })
      })
      .catch(err => next(err))
  },
  createTeacher: (req, res, next) => {
    const { courseDescription, teachingMethod, lessonDuration, availableDays, videoLink, name, avatar, nation } = req.body
    const { file } = req
    if (!courseDescription || !teachingMethod || !lessonDuration || !availableDays || !videoLink) throw new Error('請填入完整資料!')
    console.log({ courseDescription, teachingMethod, lessonDuration, availableDays, videoLink })

    const parsedAvailableDays = availableDays.map(day => Number(day))

    Teacher.findByPk(req.user.id)
      .then(teacher => {
        if (teacher) throw new Error('此使用者已成為老師!')
        return Promise.all([
          Teacher.create({
            id: req.user.id,
            courseDescription,
            teachingMethod,
            lessonDuration,
            availableDays: parsedAvailableDays,
            videoLink
          }),
          localFileHandler(file)
        ])
      })
      .then(([teacher, filePath]) => {
        return User.update({
          isTeacher: true,
          name,
          avatar: filePath || avatar,
          nation
        }, { where: { id: teacher.id } })
      })
      .then(() => {
        req.flash('success', '恭喜開課成功!')
        return res.redirect(`/teachers/${req.user.id}`)
      })
      .catch(err => next(err))
  },
  putTeacher: (req, res, next) => {
    const teacherId = Number(req.params.id)
    if (teacherId !== req.user.id) throw new Error('沒有權限修改此資料!')
    const { courseDescription, teachingMethod, lessonDuration, availableDays, videoLink, nation, name, avatar } = req.body
    const { file } = req
    const courseDescriptionInput = courseDescription.trim()
    const teachingMethodInput = teachingMethod.trim()
    console.log({ courseDescription, teachingMethod, lessonDuration, availableDays, videoLink })
    if (!courseDescription || !teachingMethod || !lessonDuration || !availableDays || !videoLink) throw new Error('請填入完整資料!')

    const parsedAvailableDays = availableDays.map(day => Number(day))
    Teacher.findByPk(teacherId)
      .then(teacher => {
        if (!teacher) throw new Error('找不到此使用者。')
        return Promise.all([
          teacher.update({
            courseDescription: courseDescriptionInput,
            teachingMethod: teachingMethodInput,
            lessonDuration,
            availableDays: parsedAvailableDays,
            videoLink
          }),
          localFileHandler(file)
        ])
      })
      .then(([teacher, filePath]) => {
        return User.update({
          name,
          nation,
          avatar: filePath || avatar
        }, { where: { id: teacher.id } })
      })
      .then(() => {
        req.flash('success_messages', '修改成功!')
        return res.redirect(`/teachers/${teacherId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = teacherControllers
