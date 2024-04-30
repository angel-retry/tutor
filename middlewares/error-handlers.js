const errorHandlers = (err, req, res, next) => {
  if (err instanceof Error) {
    console.log(err)
    req.flash('error_message', `${err.name} : ${err.message}`)
  } else {
    console.log(err)
    req.flash('error_message', `${err}`)
  }
  res.redirect('back')
  next(err)
}

module.exports = errorHandlers
