const express = require('express')
const router = require('./routes')
const app = express()
const { engine } = require('express-handlebars')

app.engine('hbs', engine({ extname: 'hbs' }))
app.set('view engine', 'hbs')

app.use(router)

app.listen(3000, () => {
  console.log('Example app listening on http://localhost:3000')
})
