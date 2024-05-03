const { Lesson, Teacher, User, Rating, Sequelize } = require('../models')
const { Op } = require('sequelize')

const userControllers = {
  getUserPage: (req, res) => {
    const userId = Number(req.params?.id)
    if (userId !== req.user.id) throw new Error('沒有權限看此資料!')
    Promise.all([
      Lesson.findAll({
        include: [{ model: Teacher, include: [User] }],
        where: {
          studentId: userId,
          startTime: {
            [Op.gt]: new Date()
          }
        }
      }),
      Lesson.findAll({
        include: [
          { model: Teacher, include: [User], attributes: ['id'] },
          { model: Rating, require: false }
        ],
        where: {
          studentId: userId,
          startTime: {
            [Op.lt]: new Date()
          },
          '$Ratings.teacher_id$': null
        }
      }),
      Lesson.findAll({
        attributes: [
          'student_id',
          [
            Sequelize.literal('SUM(TIMESTAMPDIFF(SECOND, start_time, end_time))'),
            'totalDuration'
          ],
          [
            Sequelize.literal('RANK() OVER (ORDER BY SUM(TIMESTAMPDIFF(SECOND, start_time, end_time)) DESC)'),
            'RK'
          ]
        ],
        where: {
          end_time: {
            [Op.lt]: new Date()
          }
        },
        group: ['student_id']
      })
    ])
      .then(([newLessons, lessonsWithoutRating, studentsLessonsRanks]) => {
        newLessons = newLessons.map(lesson => (
          {
            ...lesson.toJSON()
          }
        ))
        lessonsWithoutRating = lessonsWithoutRating.map(lesson => (
          {
            ...lesson.toJSON()
          }
        ))
        const studentRank = studentsLessonsRanks.find(lesson => lesson.student_id === userId).toJSON()
        console.log('ranks', studentRank)
        return res.render('user', { newLessons, lessonsWithoutRating, studentRank })
      })
  },
  getUserEditPage: (req, res) => {
    return res.render('user-edit')
  }
}

module.exports = userControllers
