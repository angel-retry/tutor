const authControllers = {
  getLoginPage: (req, res) => {
    return res.render('auth/login')
  }
}

module.exports = authControllers
