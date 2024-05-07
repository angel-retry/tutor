const localFileHandler = require('../helpers/file-helpers')
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
        newLessons = newLessons
          ? newLessons.map(lesson => (
            {
              ...lesson.toJSON()
            }
          ))
          : null
        lessonsWithoutRating = lessonsWithoutRating
          ? lessonsWithoutRating.map(lesson => (
            {
              ...lesson.toJSON()
            }
          ))
          : null
        const getStudentRank = studentsLessonsRanks.find(lesson => lesson.student_id === userId)
        const studentRank = getStudentRank ? getStudentRank.toJSON() : null
        console.log('ranks', studentRank)
        return res.render('user', { newLessons, lessonsWithoutRating, studentRank })
      })
  },
  getUserEditPage: (req, res) => {
    const userId = Number(req.params.id) || null
    if (userId !== req.user.id) throw new Error('沒有權限修改此資料!')
    User.findByPk(userId, {
      raw: true
    })
      .then(user => {
        if (!user) throw new Error('找不到此使用者。')
        return res.render('user-edit', { user })
      })
  },
  putUser: (req, res, next) => {
    const userId = Number(req.params.id) || null
    if (userId !== req.user.id) throw new Error('沒有權限修改此資料!')
    const { name, nation, avatar, introduction } = req.body
    const { file } = req
    if (!name) throw new Error('請填入姓名!')
    console.log({ name, nation, avatar, introduction })

    Promise.all([
      localFileHandler(file),
      User.findByPk(userId)
    ])
      .then(([filePath, user]) => {
        if (!user) throw new Error('找不到此使用者。')
        return user.update({ name, nation, avatar: filePath, introduction })
          .then(() => {
            req.flash('success_messages', '修改成功!')
            return res.redirect(`/users/${userId}`)
          })
          .catch(err => next(err))
      })
      .catch(err => next(err))
  }
}

module.exports = userControllers
