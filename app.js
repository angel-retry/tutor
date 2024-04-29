const express = require('express')
const app = express()
const { engine } = express.Router()

app.engine('hbs', engine({ extname: 'hbs' }))
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000, () => {
  console.log('Example app listening on http://localhost:3000!')
})
