const path = require('path')

const multer = require('multer')
const upload = multer({
  dest: '/tem/upload',
  limits: {
    fileSize: 1024 * 1024 * 2
  },
  fileFilter (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase()
    if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
      cb(new Error('檔案格式錯誤，僅限上傳 jpg、jpeg、png 與 gif 格式。'))
    }
    cb(null, true)
  }
})

module.exports = upload
