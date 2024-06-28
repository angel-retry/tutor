const fs = require('fs')
const { ImgurClient } = require('imgur')

const localFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const fileName = `upload/${file.originalname}`
    return fs.promises.readFile(file.path)
      .then(data => {
        return fs.promises.writeFile(fileName, data)
      })
      .then(() => resolve(`/${fileName}`))
      .then(err => reject(err))
  })
}

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENTID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN
    })
    return client.upload({
      image: fs.createReadStream(file.path),
      type: 'stream'
    })
      .then(imagurData => resolve(imagurData.data.link))
      .catch(err => reject(err))
  })
}

module.exports = {
  localFileHandler,
  imgurFileHandler
}
