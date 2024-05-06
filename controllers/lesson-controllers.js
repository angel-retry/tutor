const { Teacher, User, Rating, Sequelize, Lesson } = require('../models')
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

        console.log('teacherAvailableDays', teacherAvailableDays)
        console.log('teacherAvailableDates', teacherAvailableDates)
        console.log('teacher', teacher)
        console.log('filteredAvailableDates', filteredAvailableDates)

        return res.render('lesson', { teacher, filteredAvailableDates })
      })
  }
}

module.exports = lessonControllers
