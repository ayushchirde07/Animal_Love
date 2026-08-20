const express = require('express')
const multer = require('multer')
const path = require('path')
const authMiddleware = require('../middleware/authMiddleware')
const { updateProfile, changePassword, getProfileStats } = require('../controllers/userController')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = process.env.VERCEL ? path.join('/tmp', 'uploads') : path.join(__dirname, '..', 'uploads')
    try {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true })
      }
    } catch (e) {}
    cb(null, dest)
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now()
    const safeName = file.originalname.toLowerCase().replace(/[^a-z0-9.-]/g, '-')
    cb(null, `${req.user.userId}-${timestamp}-${safeName}`)
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  cb(null, allowed.includes(file.mimetype))
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
})

const router = express.Router()

router.patch('/profile', authMiddleware, upload.single('profileImage'), updateProfile)
router.patch('/change-password', authMiddleware, changePassword)
router.get('/profile/stats', authMiddleware, getProfileStats)

module.exports = router
