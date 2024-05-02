const { Teacher, User } = require('../models')
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

    Teacher.findAndCountAll({
      include: [User],
      where: searchCondition,
      raw: true,
      nest: true,
      offset,
      limit
    })
      .then(teachers => {
        console.log('teachers', teachers)
        const teachersData = teachers.rows.map(teacher => (
          {
            ...teacher,
            courseDescription: teacher.courseDescription.length > 100 ? teacher.courseDescription.substring(0, 100) + '...' : teacher.courseDescription
          }
        ))
        return res.render('home', { teachers: teachersData, page, pagination: getPagination(page, limit, teachers.count), keyword })
      })
      .catch(err => next(err))
  }
}

module.exports = homeControllers
