const { Teacher, User, Lesson, Sequelize } = require('../models')
const { Op } = require('sequelize')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')

const homeControllers = {
  getHomePage: (req, res, next) => {
    const limit = 6
    const page = Number(req.query.page) || 1
    const offset = getOffset(page, limit)

    const keyword = req.query.keyword?.trim() || ''
    // 搜尋條件，判斷是否有關鍵字才會增加以下內容
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
        attributes: ['id', 'courseDescription'],
        include: {
          model: User,
          attributes: ['id', 'name', 'avatar', 'nation']
        },
        where: searchCondition,
        raw: true,
        nest: true,
        offset,
        limit
      }),
      Lesson.findAll({
        attributes: [
          'student_id',
          // 新增一個欄位，為課堂的總時數
          [
            Sequelize.literal('SUM(TIMESTAMPDIFF(SECOND, start_time, end_time))'),
            'totalDuration'
          ],
          // 新增一個欄位，為課堂的總時數RANK()
          [
            Sequelize.literal('RANK() OVER (ORDER BY SUM(TIMESTAMPDIFF(SECOND, start_time, end_time)) DESC)'),
            'RK'
          ]
        ],
        include: [
          { model: User, attributes: ['id', 'name', 'avatar'] }
        ],
        // 只能選取過去時間
        where: {
          end_time: {
            [Op.lt]: new Date()
          }
        },
        // 用studentId進行分組
        group: ['student_id'],
        // 根據totalDuration進行DESC排序
        order: [[Sequelize.literal('totalDuration'), 'DESC']],
        raw: true,
        nest: true,
        // 只能前10筆資料(也就是前10名)
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
        return res.render('home', { teachers: teachersData, page, pagination: getPagination(page, limit, teachers.count), keyword, top10DurationTimeStudents })
      })
      .catch(err => next(err))
  }
}

module.exports = homeControllers
