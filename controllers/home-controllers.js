const { Teacher, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')

const homeControllers = {
  getHomePage: (req, res, next) => {
    const limit = 6
    const page = Number(req.query.page) || 1
    const offset = getOffset(page, limit)
    Teacher.findAndCountAll({
      include: [User],
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
        return res.render('home', { teachers: teachersData, page, pagination: getPagination(page, limit, teachers.count) })
      })
      .catch(err => next(err))
  }
}

module.exports = homeControllers
