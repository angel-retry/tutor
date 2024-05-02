const { Teacher, User } = require('../models')

const homeControllers = {
  getHomePage: (req, res, next) => {
    Teacher.findAll({
      include: [User],
      raw: true,
      nest: true
    })
      .then(teachers => {
        console.log('teachers', teachers)
        const teachersData = teachers.map(teacher => (
          {
            ...teacher,
            courseDescription: teacher.courseDescription.substring(0, 100) + '...'
          }
        ))
        return res.render('home', { teachers: teachersData })
      })
      .catch(err => next(err))
  }
}

module.exports = homeControllers
