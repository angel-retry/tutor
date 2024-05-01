const userControllers = {
  getUserPage: (req, res) => {
    return res.render('user')
  },
  getUserEditPage: (req, res) => {
    return res.render('user-edit')
  }
}

module.exports = userControllers
