const { Teacher, User, Rating, Sequelize, Lesson } = require('../models')
const { Op } = require('sequelize')
const { getTeacherAvailableDates, getStartTimeAndEndTime, getFilterAvailableSlots } = require('../helpers/teacher-avaliable-days-helpers')

const lessonControllers = {
  getLessonPage: (req, res) => {
    const teacherId = req.params.teacherId

    Teacher.findByPk(teacherId, {
      include: [User, Rating, Lesson],
      attributes: {
        // 加入include表示原資料表的欄位也要包括進去
        include: [
          // 選取老師的rating總評分
          [
            Sequelize.literal('(SELECT ROUND(AVG(rating), 1) FROM Ratings WHERE Ratings.teacher_id = Teacher.id)'), 'totalRating'
          ]
        ]
      }
    })
      .then((teacher) => {
        teacher = teacher.toJSON()
        // 取得老師可以上課的日子
        const teacherAvailableDays = getTeacherAvailableDates(teacher.availableDays)
        // 取得老師可以上課的日子及詳細時間表
        const teacherAvailableDates = teacherAvailableDays.flatMap(day => {
          return getStartTimeAndEndTime(day, teacher.lessonDuration)
        })
        // 過濾出老師可以上課的時間
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
    const teacherId = req.params.teacherId
    if (!createLesson) throw new Error('請選擇時間!')

    // startTime, endTime將從createLesson分離成變數，型態為date
    const [startTime, endTime] = createLesson.split(',').map(dateString => new Date(dateString))

    Promise.all([
      Lesson.findAll({
        // 檢查老師是否有撞期課程
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
      // 檢查學生是否有撞期課程
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
        // 如果老師課程撞期，送出錯誤
        if (checkTeacherLesson.length > 0) {
          const lessonJsonString = JSON.stringify(checkTeacherLesson[0])
          req.flash('add_lesson_error_teacher', lessonJsonString)
          return res.redirect(`/lessons/${teacherId}`)
        }
        // 如果學生課程撞期，送出錯誤
        if (checkStudentLesson.length > 0) {
          const lessonJsonString = JSON.stringify(checkStudentLesson[0])
          req.flash('add_lesson_error_student', lessonJsonString)
          return res.redirect(`/lessons/${teacherId}`)
        }
        // 都沒有，才可加入課程
        return Lesson.create({
          startTime,
          endTime,
          studentId: req.user.id,
          teacherId
        })
      })
      .then(() => {
        // 課程預約成功，送出成功
        const lesson = { startTime, endTime }
        const lessonJsonString = JSON.stringify(lesson)
        req.flash('add_lesson_success', lessonJsonString)
        return res.redirect(`/lessons/${teacherId}`)
      })
      .catch(err => next(err))
  }

}

module.exports = lessonControllers
