const { getOffset, getPagination } = require('../helpers/pagination-helpers')
const { User } = require('../models')

const adminControllers = {
  getAdminPage: (req, res) => {
    const limit = 20
    const page = Number(req.query.page) || 1
    const offset = getOffset(page, limit)
    User.findAndCountAll({
      attributes: ['id', 'name', 'email', 'isTeacher'],
      raw: true,
      offset,
      limit
    })
      .then(users => {
        return res.render('admin/admin', { users: users.rows, page, pagination: getPagination(page, limit, users.count) })
      })
  }
}

module.exports = adminControllers
