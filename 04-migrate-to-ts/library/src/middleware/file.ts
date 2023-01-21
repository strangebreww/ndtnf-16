const multer = require('multer')

const storage = multer.diskStorage({
  destination (_req, _file, cb) {
    cb(null, 'public/uploads')
  },
  filename (_req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const allowedTypes = ['text/plain', 'text/html', 'application/pdf']

const fileFilter = (_req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

module.exports = multer({ storage, fileFilter })
