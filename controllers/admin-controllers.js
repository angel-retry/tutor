const { Op } = require('sequelize')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')
const { User } = require('../models')

const adminControllers = {
  getAdminPage: (req, res) => {
    const limit = 20
    const page = Number(req.query.page) || 1
    const offset = getOffset(page, limit)
    const keyword = req.query.keyword?.trim() || ''
    let searchCondition = {}
    if (keyword === '學生') {
      searchCondition = {
        isTeacher: false
      }
    } else if (keyword === '老師') {
      searchCondition = {
        isTeacher: true
      }
    } else if (keyword) {
      searchCondition =
        {
          [Op.or]: [
            { id: { [Op.like]: `${keyword}` } },
            { name: { [Op.like]: `${keyword}` } },
            { email: { [Op.like]: `${keyword}` } }
          ]
        }
    }
    User.findAndCountAll({
      attributes: ['id', 'name', 'email', 'isTeacher'],
      raw: true,
      offset,
      limit,
      where: searchCondition
    })
      .then(users => {
        return res.render('admin/admin', { users: users.rows, page, pagination: getPagination(page, limit, users.count), keyword })
      })
  }
}

module.exports = adminControllers
