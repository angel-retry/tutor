const fs = require('fs')

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

module.exports = localFileHandler
