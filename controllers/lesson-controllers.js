const { Teacher, User, Rating, Sequelize, Lesson } = require('../models')
const { Op } = require('sequelize')
const { getTeacherAvailableDates, getStartTimeAndEndTime, getFilterAvailableSlots } = require('../helpers/teacher-avaliable-days-helpers')

const lessonControllers = {
  getLessonPage: (req, res) => {
    const teacherId = req.params.id
    Teacher.findByPk(teacherId, {
      include: [User, Rating, Lesson],
      attributes: {
        include: [
          [
            Sequelize.literal('(SELECT ROUND(AVG(rating), 1) FROM Ratings WHERE Ratings.teacher_id = Teacher.id)'), 'totalRating'
          ]
        ]
      }
    })
      .then((teacher) => {
        teacher = teacher.toJSON()
        // 取得老師可以的日子
        const teacherAvailableDays = getTeacherAvailableDates(teacher.availableDays)
        // 取得老師可以的日子及上課時間表
        const teacherAvailableDates = teacherAvailableDays.flatMap(day => {
          return getStartTimeAndEndTime(day, teacher.lessonDuration)
        })
        const filteredAvailableDates = getFilterAvailableSlots(teacherAvailableDates, teacher.Lessons)

        // console.log('teacherAvailableDays', teacherAvailableDays)
        // console.log('teacherAvailableDates', teacherAvailableDates)
        // console.log('teacher', teacher)
        // console.log('filteredAvailableDates', filteredAvailableDates)

        return res.render('lesson', { teacher, filteredAvailableDates })
      })
  },
  postLesson: (req, res, next) => {
    const { createLesson } = req.body
    const teacherId = req.params.id
    if (!createLesson) throw new Error('請選擇時間!')
    console.log('createLesson', createLesson)
    const [startTime, endTime] = createLesson.split(',').map(dateString => new Date(dateString))
    console.log({ startTime, endTime })

    Promise.all([
      Lesson.findAll({
        where: {
          teacherId,
          [Op.or]: [
            {
              [Op.and]: [
                { startTime: { [Op.lt]: endTime } },
                { endTime: { [Op.gt]: startTime } }
              ]
            },
            {
              [Op.and]: [
                { startTime: { [Op.lt]: endTime } },
                { endTime: { [Op.gt]: endTime } }
              ]
            },
            {
              [Op.and]: [
                { startTime: { [Op.gt]: startTime } },
                { endTime: { [Op.lt]: endTime } }
              ]
            }
          ]
        }
      }),
      Lesson.findAll({
        include: [{
          model: Teacher,
          attributes: ['id'],
          include: { model: User, attributes: ['id', 'name'] }
        }],
        where: {
          studentId: req.user.id,
          [Op.or]: [
            {
              [Op.and]: [
                { startTime: { [Op.lt]: endTime } },
                { endTime: { [Op.gt]: startTime } }
              ]
            },
            {
              [Op.and]: [
                { startTime: { [Op.lt]: endTime } },
                { endTime: { [Op.gt]: endTime } }
              ]
            },
            {
              [Op.and]: [
                { startTime: { [Op.gt]: startTime } },
                { endTime: { [Op.lt]: endTime } }
              ]
            }
          ]
        }
      })
    ])
      .then(([checkTeacherLesson, checkStudentLesson]) => {
        console.log('lesson', checkStudentLesson)
        if (checkTeacherLesson.length > 0) {
          const lessonJsonString = JSON.stringify(checkTeacherLesson[0])
          req.flash('add_lesson_error_teacher', lessonJsonString)
          return res.redirect(`/lessons/${teacherId}`)
        }
        if (checkStudentLesson.length > 0) {
          const lessonJsonString = JSON.stringify(checkStudentLesson[0])
          req.flash('add_lesson_error_student', lessonJsonString)
          return res.redirect(`/lessons/${teacherId}`)
        }
        return Lesson.create({
          startTime,
          endTime,
          studentId: req.user.id,
          teacherId
        })
      })
      .then(() => {
        const lesson = { startTime, endTime }
        const lessonJsonString = JSON.stringify(lesson)
        console.log('lessonJsonString', lessonJsonString)
        req.flash('add_lesson_success', lessonJsonString)
        return res.redirect(`/lessons/${teacherId}`)
      })
      .catch(err => next(err))
  }

}

module.exports = lessonControllers
