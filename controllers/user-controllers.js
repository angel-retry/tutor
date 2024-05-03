const { Lesson, Teacher, User, Rating } = require('../models')
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
      })
    ])
      .then(([newLessons, lessonsWithoutRating]) => {
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
        console.log('newLessons', newLessons)
        console.log('teachersWithoutRating', lessonsWithoutRating)
        return res.render('user', { newLessons, lessonsWithoutRating })
      })
  },
  getUserEditPage: (req, res) => {
    return res.render('user-edit')
  }
}

module.exports = userControllers
