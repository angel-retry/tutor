const { Teacher, User, Lesson, Sequelize } = require('../models')
const { Op } = require('sequelize')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')

const homeControllers = {
  getHomePage: (req, res, next) => {
    const limit = 6
    const page = Number(req.query.page) || 1
    const offset = getOffset(page, limit)

    const keyword = req.query.keyword?.trim() || ''
    const searchCondition = keyword
      ? {
          [Op.or]: [
            { '$User.name$': { [Op.like]: `%${keyword}%` } },
            { course_description: { [Op.like]: `%${keyword}%` } },
            { '$User.nation$': { [Op.like]: `%${keyword}%` } }
          ]
        }
      : {}
    Promise.all([
      Teacher.findAndCountAll({
        include: { model: User },
        where: searchCondition,
        raw: true,
        nest: true,
        offset,
        limit
      }),
      Lesson.findAll({
        attributes: [
          'student_id',
          [
            Sequelize.literal('SUM(TIMESTAMPDIFF(SECOND, start_time, end_time))'),
            'totalDuration'
          ]
        ],
        include: [User],
        where: {
          end_time: {
            [Op.lt]: new Date()
          }
        },
        group: ['student_id'],
        order: [[Sequelize.literal('totalDuration'), 'DESC']],
        raw: true,
        nest: true,
        limit: 10
      })
    ])

      .then(([teachers, top10DurationTimeStudents]) => {
        const teachersData = teachers.rows.map(teacher => (
          {
            ...teacher,
            courseDescription: teacher.courseDescription.length > 100 ? teacher.courseDescription.substring(0, 100) + '...' : teacher.courseDescription
          }
        ))
        top10DurationTimeStudents = top10DurationTimeStudents.map((lesson, index) => ({
          ...lesson,
          ranking: index + 1
        }))
        return res.render('home', { teachers: teachersData, page, pagination: getPagination(page, limit, teachers.count), keyword, top10DurationTimeStudents })
      })
      .catch(err => next(err))
  }
}

module.exports = homeControllers
