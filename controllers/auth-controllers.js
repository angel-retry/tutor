const authControllers = {
  getLoginPage: (req, res) => {
    return res.render('auth/login')
  },
  getRegisterPage: (req, res) => {
    return res.render('auth/register')
  }
}

module.exports = authControllers
